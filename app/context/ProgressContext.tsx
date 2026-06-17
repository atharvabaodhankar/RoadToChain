"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { 
  subscribeToAuth, 
  loginWithGoogle, 
  logoutUser, 
  loadUserProgress, 
  saveUserProgress, 
  isFirebaseConfigured,
  UserProgressData
} from "@/lib/firebase";
import { User as FirebaseUser } from "firebase/auth";

interface CompletedLesson {
  trackSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  completedAt: number;
}

interface ProgressContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isFirebaseConfigured: boolean;
  completed: CompletedLesson[];
  simulatorUsage: Record<string, number>;
  mistakeViews: Record<string, number>;
  lessonViews: Record<string, number>;
  getCompletedCountForTrack: (trackSlug: string) => number;
  getTrackProgress: (trackSlug: string, totalLessons: number) => number;
  isComplete: (trackSlug: string, moduleSlug: string, lessonSlug: string) => boolean;
  markComplete: (trackSlug: string, moduleSlug: string, lessonSlug: string) => Promise<void>;
  markIncomplete: (trackSlug: string, moduleSlug: string, lessonSlug: string) => Promise<void>;
  trackSimulatorUsage: (simulatorId: string) => Promise<void>;
  trackMistakeView: (mistakeId: string) => Promise<void>;
  trackLessonView: (trackSlug: string, moduleSlug: string, lessonSlug: string) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "roadtochain_progress";

const defaultProgress: Omit<UserProgressData, "updatedAt"> = {
  completed: [],
  simulatorUsage: {},
  mistakeViews: {},
  lessonViews: {},
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Omit<UserProgressData, "updatedAt">>(defaultProgress);

  // Helper to load local state
  const loadLocalProgress = (): Omit<UserProgressData, "updatedAt"> => {
    if (typeof window === "undefined") return defaultProgress;
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          completed: parsed.completed || [],
          simulatorUsage: parsed.simulatorUsage || {},
          mistakeViews: parsed.mistakeViews || {},
          lessonViews: parsed.lessonViews || {},
        };
      }
    } catch (e) {
      console.error("Error reading local progress:", e);
    }
    return defaultProgress;
  };

  // Helper to save progress (both local and optionally Firebase)
  const saveProgress = useCallback(async (
    newProgress: Omit<UserProgressData, "updatedAt">,
    currentUser: FirebaseUser | null
  ) => {
    setProgress(newProgress);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProgress));
      } catch (e) {
        console.error("Error saving local progress:", e);
      }
    }
    if (currentUser && isFirebaseConfigured) {
      await saveUserProgress(currentUser.uid, {
        ...newProgress,
        updatedAt: Date.now(),
      });
    }
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(true);
      
      if (firebaseUser) {
        // Logged in: Load from Firebase
        const dbProgress = await loadUserProgress(firebaseUser.uid);
        if (dbProgress) {
          // Merge local and db progress, taking latest or merging completions
          const local = loadLocalProgress();
          const mergedCompletions = [...dbProgress.completed];
          
          local.completed.forEach((locItem) => {
            const exists = mergedCompletions.some(
              (dbItem) =>
                dbItem.trackSlug === locItem.trackSlug &&
                dbItem.moduleSlug === locItem.moduleSlug &&
                dbItem.lessonSlug === locItem.lessonSlug
            );
            if (!exists) {
              mergedCompletions.push(locItem);
            }
          });

          const mergedProgress = {
            completed: mergedCompletions,
            simulatorUsage: { ...local.simulatorUsage, ...dbProgress.simulatorUsage },
            mistakeViews: { ...local.mistakeViews, ...dbProgress.mistakeViews },
            lessonViews: { ...local.lessonViews, ...dbProgress.lessonViews },
          };
          
          await saveProgress(mergedProgress, firebaseUser);
        } else {
          // No DB progress yet: save local progress to DB
          const local = loadLocalProgress();
          await saveProgress(local, firebaseUser);
        }
      } else {
        // Logged out: fallback to local storage
        const local = loadLocalProgress();
        setProgress(local);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [saveProgress]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCompletedCountForTrack = useCallback((trackSlug: string) => {
    return progress.completed.filter((item) => item.trackSlug === trackSlug).length;
  }, [progress.completed]);

  const getTrackProgress = useCallback((trackSlug: string, totalLessons: number) => {
    if (totalLessons === 0) return 0;
    const completedCount = getCompletedCountForTrack(trackSlug);
    return Math.round((completedCount / totalLessons) * 100);
  }, [getCompletedCountForTrack]);

  const isComplete = useCallback((trackSlug: string, moduleSlug: string, lessonSlug: string) => {
    return progress.completed.some(
      (item) =>
        item.trackSlug === trackSlug &&
        item.moduleSlug === moduleSlug &&
        item.lessonSlug === lessonSlug
    );
  }, [progress.completed]);

  const markComplete = useCallback(async (trackSlug: string, moduleSlug: string, lessonSlug: string) => {
    setProgress((prev) => {
      const alreadyComplete = prev.completed.some(
        (item) =>
          item.trackSlug === trackSlug &&
          item.moduleSlug === moduleSlug &&
          item.lessonSlug === lessonSlug
      );
      if (alreadyComplete) return prev;
      
      const newCompleted = [
        ...prev.completed,
        { trackSlug, moduleSlug, lessonSlug, completedAt: Date.now() },
      ];
      const updated = { ...prev, completed: newCompleted };
      
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
      if (user && isFirebaseConfigured) {
        saveUserProgress(user.uid, {
          ...updated,
          updatedAt: Date.now(),
        }).catch(console.error);
      }
      return updated;
    });
  }, [user]);

  const markIncomplete = useCallback(async (trackSlug: string, moduleSlug: string, lessonSlug: string) => {
    setProgress((prev) => {
      const newCompleted = prev.completed.filter(
        (item) =>
          !(
            item.trackSlug === trackSlug &&
            item.moduleSlug === moduleSlug &&
            item.lessonSlug === lessonSlug
          )
      );
      const updated = { ...prev, completed: newCompleted };
      
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
      if (user && isFirebaseConfigured) {
        saveUserProgress(user.uid, {
          ...updated,
          updatedAt: Date.now(),
        }).catch(console.error);
      }
      return updated;
    });
  }, [user]);

  const trackSimulatorUsage = useCallback(async (simulatorId: string) => {
    setProgress((prev) => {
      const currentCount = prev.simulatorUsage[simulatorId] || 0;
      const newUsage = {
        ...prev.simulatorUsage,
        [simulatorId]: currentCount + 1,
      };
      const updated = { ...prev, simulatorUsage: newUsage };
      
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
      if (user && isFirebaseConfigured) {
        saveUserProgress(user.uid, {
          ...updated,
          updatedAt: Date.now(),
        }).catch(console.error);
      }
      return updated;
    });
  }, [user]);

  const trackMistakeView = useCallback(async (mistakeId: string) => {
    setProgress((prev) => {
      const currentCount = prev.mistakeViews[mistakeId] || 0;
      const newViews = {
        ...prev.mistakeViews,
        [mistakeId]: currentCount + 1,
      };
      const updated = { ...prev, mistakeViews: newViews };
      
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
      if (user && isFirebaseConfigured) {
        saveUserProgress(user.uid, {
          ...updated,
          updatedAt: Date.now(),
        }).catch(console.error);
      }
      return updated;
    });
  }, [user]);

  const trackLessonView = useCallback(async (trackSlug: string, moduleSlug: string, lessonSlug: string) => {
    const key = `${trackSlug}/${moduleSlug}/${lessonSlug}`;
    setProgress((prev) => {
      const currentCount = prev.lessonViews[key] || 0;
      const newViews = {
        ...prev.lessonViews,
        [key]: currentCount + 1,
      };
      const updated = { ...prev, lessonViews: newViews };
      
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
      if (user && isFirebaseConfigured) {
        saveUserProgress(user.uid, {
          ...updated,
          updatedAt: Date.now(),
        }).catch(console.error);
      }
      return updated;
    });
  }, [user]);

  return (
    <ProgressContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        logout,
        isFirebaseConfigured,
        completed: progress.completed,
        simulatorUsage: progress.simulatorUsage,
        mistakeViews: progress.mistakeViews,
        lessonViews: progress.lessonViews,
        getCompletedCountForTrack,
        getTrackProgress,
        isComplete,
        markComplete,
        markIncomplete,
        trackSimulatorUsage,
        trackMistakeView,
        trackLessonView,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};
