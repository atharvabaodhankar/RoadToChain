import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  Firestore 
} from "firebase/firestore";

// Firebase Config from Env
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if credentials are valid
export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId
);

let app;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
} else {
  console.warn("Firebase credentials not configured. Falling back to local state & localStorage.");
}

export { auth, db };

// ── Auth Functions ───────────────────────────────────────────────────────────

export async function loginWithGoogle(): Promise<FirebaseUser | null> {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    console.warn("Firebase Auth not configured. Google Login is disabled.");
    return null;
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  if (!isFirebaseConfigured || !auth) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Firebase Sign-Out Error:", error);
    throw error;
  }
}

export function subscribeToAuth(callback: (user: FirebaseUser | null) => void) {
  if (!isFirebaseConfigured || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// ── Database Sync Functions ──────────────────────────────────────────────────

export interface UserProgressData {
  completed: Array<{
    trackSlug: string;
    moduleSlug: string;
    lessonSlug: string;
    completedAt: number;
  }>;
  simulatorUsage: Record<string, number>;
  mistakeViews: Record<string, number>;
  lessonViews: Record<string, number>;
  updatedAt: number;
}

export async function saveUserProgress(uid: string, data: UserProgressData): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, {
      ...data,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (error) {
    console.error("Error saving user progress to Firebase:", error);
  }
}

export async function loadUserProgress(uid: string): Promise<UserProgressData | null> {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProgressData;
    }
  } catch (error) {
    console.error("Error loading user progress from Firebase:", error);
  }
  return null;
}
