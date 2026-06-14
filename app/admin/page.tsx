"use client";

import { useEffect, useState, useMemo } from "react";
import { useProgress } from "@/app/context/ProgressContext";
import { getAdminData, AdminFeedbackData, AdminUserData } from "@/lib/firebase";
import {
  ShieldAlert,
  ThumbsUp,
  ThumbsDown,
  Users,
  Eye,
  ArrowLeft,
  Loader2,
  Lock,
  Search,
  CheckCircle,
  FileText
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const { user, loading: authLoading, signInWithGoogle, logout } = useProgress();
  const [adminData, setAdminData] = useState<{ feedbacks: AdminFeedbackData[]; users: AdminUserData[] } | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [feedbackFilter, setFeedbackFilter] = useState<"all" | "up" | "down">("all");
  const [activeTab, setActiveTab] = useState<"feedback" | "views" | "simulators">("feedback");

  const isAdmin = user?.email === "baodhankaratharva@gmail.com";

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setDataLoading(true);
    setError(null);
    try {
      const data = await getAdminData();
      if (data) {
        setAdminData(data);
      } else {
        setError("Failed to fetch admin data or database not configured.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setDataLoading(false);
    }
  };

  // Aggregated Telemetry Calculations
  const metrics = useMemo(() => {
    if (!adminData) return { totalViews: 0, totalSims: 0, upCount: 0, downCount: 0, uniqueLessonsViewed: 0 };
    
    let totalViews = 0;
    let totalSims = 0;
    const lessonViewCounts: Record<string, number> = {};
    const simCounts: Record<string, number> = {};

    // Aggregate from users
    adminData.users.forEach((u: AdminUserData) => {
      if (u.lessonViews) {
        Object.entries(u.lessonViews).forEach(([lesson, count]) => {
          const c = typeof count === "number" ? count : 0;
          totalViews += c;
          lessonViewCounts[lesson] = (lessonViewCounts[lesson] || 0) + c;
        });
      }
      if (u.simulatorUsage) {
        Object.entries(u.simulatorUsage).forEach(([sim, count]) => {
          const c = typeof count === "number" ? count : 0;
          totalSims += c;
          simCounts[sim] = (simCounts[sim] || 0) + c;
        });
      }
    });

    const upCount = adminData.feedbacks.filter((f) => f.type === "up").length;
    const downCount = adminData.feedbacks.filter((f) => f.type === "down").length;

    return {
      totalViews,
      totalSims,
      upCount,
      downCount,
      uniqueLessonsViewed: Object.keys(lessonViewCounts).length,
      lessonViewCounts,
      simCounts
    };
  }, [adminData]);

  // Filters feedbacks
  const filteredFeedbacks = useMemo(() => {
    if (!adminData) return [];
    return adminData.feedbacks.filter((f) => {
      const matchType = feedbackFilter === "all" || f.type === feedbackFilter;
      const matchSearch =
        (f.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.lessonSlug || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.issues || "").toLowerCase().includes(searchTerm.toLowerCase());
      return matchType && matchSearch;
    }).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [adminData, feedbackFilter, searchTerm]);

  // Sorted list of lesson views
  const sortedLessonViews = useMemo(() => {
    if (!metrics.lessonViewCounts) return [];
    return Object.entries(metrics.lessonViewCounts)
      .map(([lesson, count]) => ({ lesson, count }))
      .sort((a, b) => b.count - a.count);
  }, [metrics]);

  // Sorted list of simulators
  const sortedSimUsage = useMemo(() => {
    if (!metrics.simCounts) return [];
    return Object.entries(metrics.simCounts)
      .map(([sim, count]) => ({ sim, count }))
      .sort((a, b) => b.count - a.count);
  }, [metrics]);

  // Format Timestamps
  const formatTime = (ts: number | undefined) => {
    if (!ts) return "N/A";
    const date = new Date(ts);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Auth gate checks
  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-text">
        <Loader2 className="h-8 w-8 text-accent animate-spin mb-4" />
        <span className="font-mono text-xs text-dim">Verifying admin credentials...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-text">
        <div className="max-w-md w-full bg-bg2/40 border border-border rounded-xl p-8 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-border3/40" />
          <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-border3/40" />
          <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-border3/40" />
          <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-border3/40" />
          
          <div className="inline-flex p-3 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <Lock className="h-6 w-6" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight">Access Restrained</h1>
            <p className="text-xs text-muted leading-relaxed">
              This terminal route is strictly calibrated for <span className="text-accent font-mono">baodhankaratharva@gmail.com</span> only.
            </p>
          </div>

          {user ? (
            <div className="space-y-4">
              <div className="bg-bg/60 p-3 rounded-lg border border-border font-mono text-[10px] text-left space-y-1">
                <div><span className="text-dim">IDENTIFIED AS:</span> {user.displayName}</div>
                <div><span className="text-dim">EMAIL:</span> {user.email}</div>
                <div><span className="text-dim">STATUS:</span> ACCESS DENIED</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={logout}
                  className="flex-1 rounded-lg border border-border bg-bg hover:bg-bg3 py-2 text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  Sign Out
                </button>
                <Link
                  href="/curriculum"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent hover:bg-accent-hover py-2 text-xs font-mono font-bold text-white transition-all cursor-pointer"
                >
                  <ArrowLeft className="h-3 w-3" /> Return Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={signInWithGoogle}
                className="rounded-lg bg-accent hover:bg-accent-hover py-2 text-xs font-mono font-bold text-white transition-all cursor-pointer"
              >
                Sign In with Google
              </button>
              <Link
                href="/curriculum"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-bg hover:bg-bg3 py-2 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                <ArrowLeft className="h-3 w-3" /> Back to Safety
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent/30 font-sans pb-24">
      {/* Admin Header */}
      <section className="relative overflow-hidden border-b border-border bg-bg2/40 px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-6xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-accent uppercase tracking-wider mb-2">
              <ShieldAlert className="h-3.5 w-3.5 text-accent animate-pulse" />
              <span>Secure Admin Console</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.03em]">
              RoadToChain Dashboard
            </h1>
            <p className="text-xs text-muted mt-1">
              Live feedback logging, aggregated lessons telemetry & simulator events metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={dataLoading}
              className="px-3 py-1.5 rounded-lg border border-border bg-bg hover:bg-bg3 font-mono text-[10px] font-bold text-text transition-all cursor-pointer disabled:opacity-50"
            >
              {dataLoading ? "Refreshing..." : "Sync Database"}
            </button>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 font-mono text-[10px] font-bold text-rose-400 transition-all cursor-pointer"
            >
              Exit Terminal
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl p-4 text-xs font-mono text-rose-400 flex items-start gap-2.5">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Database Access Error:</span>
              <p className="mt-1 opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-bg2/40 border border-border/80 rounded-xl p-4 space-y-2 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-dim"><FileText className="h-4 w-4" /></div>
            <div className="font-mono text-[9px] uppercase font-bold text-dim">Total Feedbacks</div>
            <div className="text-2xl font-bold font-mono">{(adminData?.feedbacks.length || 0)}</div>
          </div>
          
          <div className="bg-bg2/40 border border-border/80 rounded-xl p-4 space-y-2 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-emerald-500"><ThumbsUp className="h-4 w-4" /></div>
            <div className="font-mono text-[9px] uppercase font-bold text-emerald-500">Positive Logs</div>
            <div className="text-2xl font-bold font-mono text-emerald-500">{metrics.upCount}</div>
          </div>

          <div className="bg-bg2/40 border border-border/80 rounded-xl p-4 space-y-2 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-rose-500"><ThumbsDown className="h-4 w-4" /></div>
            <div className="font-mono text-[9px] uppercase font-bold text-rose-500">Negative Logs</div>
            <div className="text-2xl font-bold font-mono text-rose-500">{metrics.downCount}</div>
          </div>

          <div className="bg-bg2/40 border border-border/80 rounded-xl p-4 space-y-2 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-dim"><Users className="h-4 w-4" /></div>
            <div className="font-mono text-[9px] uppercase font-bold text-dim">Registered Users</div>
            <div className="text-2xl font-bold font-mono">{(adminData?.users.length || 0)}</div>
          </div>

          <div className="bg-bg2/40 border border-border/80 rounded-xl p-4 col-span-2 lg:col-span-1 space-y-2 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-accent"><Eye className="h-4 w-4" /></div>
            <div className="font-mono text-[9px] uppercase font-bold text-accent">Total Lesson Views</div>
            <div className="text-2xl font-bold font-mono text-accent">{metrics.totalViews}</div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="border-b border-border/60 flex items-center gap-1 select-none">
          <button
            onClick={() => setActiveTab("feedback")}
            className={`px-4 py-2 text-xs font-mono font-bold tracking-tight border-b-2 transition-all cursor-pointer ${
              activeTab === "feedback"
                ? "border-accent text-accent"
                : "border-transparent text-dim hover:text-text"
            }`}
          >
            Feedback Logs ({filteredFeedbacks.length})
          </button>
          <button
            onClick={() => setActiveTab("views")}
            className={`px-4 py-2 text-xs font-mono font-bold tracking-tight border-b-2 transition-all cursor-pointer ${
              activeTab === "views"
                ? "border-accent text-accent"
                : "border-transparent text-dim hover:text-text"
            }`}
          >
            Lesson View Metrics ({sortedLessonViews.length})
          </button>
          <button
            onClick={() => setActiveTab("simulators")}
            className={`px-4 py-2 text-xs font-mono font-bold tracking-tight border-b-2 transition-all cursor-pointer ${
              activeTab === "simulators"
                ? "border-accent text-accent"
                : "border-transparent text-dim hover:text-text"
            }`}
          >
            Simulator Action Metrics ({sortedSimUsage.length})
          </button>
        </div>

        {/* Dynamic Panels */}
        {dataLoading ? (
          <div className="text-center py-20">
            <Loader2 className="h-8 w-8 text-accent animate-spin mx-auto mb-3" />
            <span className="font-mono text-xs text-dim">Syncing database assets...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* tab 1: Feedback */}
            {activeTab === "feedback" && (
              <div className="space-y-4">
                {/* Search / Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-dim" />
                    <input
                      type="text"
                      placeholder="Search email, lesson, or feedback issues..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-bg2/50 border border-border rounded-lg text-xs focus:outline-none focus:border-border2 placeholder:text-dim font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 select-none self-end sm:self-auto">
                    {[
                      { val: "all", label: "All Logs" },
                      { val: "up", label: "Positive Only" },
                      { val: "down", label: "Negative Only" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setFeedbackFilter(opt.val as "all" | "up" | "down")}
                        className={`rounded px-2.5 py-1 text-[10px] font-mono transition-all cursor-pointer border ${
                          feedbackFilter === opt.val
                            ? "border-text text-text bg-bg3"
                            : "border-border bg-bg/40 text-dim hover:text-text hover:border-border2"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback Logs Stack */}
                <div className="space-y-4">
                  {filteredFeedbacks.map((f) => (
                    <div
                      key={f.id}
                      className="rounded-xl border border-border/80 bg-bg2/30 p-5 space-y-3 relative overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/30 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[9px] font-bold border uppercase tracking-wider ${
                              f.type === "up"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            }`}
                          >
                            {f.type === "up" ? (
                              <>
                                <ThumbsUp className="h-2.5 w-2.5" /> Helpful
                              </>
                            ) : (
                              <>
                                <ThumbsDown className="h-2.5 w-2.5" /> Issues Found
                              </>
                            )}
                          </span>
                          <span className="font-mono text-xs text-text font-bold">
                            {f.email || "Anonymous User"}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-dim">{formatTime(f.timestamp)}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        <div>
                          <span className="block text-[8px] text-dim uppercase">Lesson Target</span>
                          <span className="text-text break-all">{f.trackSlug} / {f.moduleSlug} / {f.lessonSlug}</span>
                        </div>
                        {f.uid && (
                          <div>
                            <span className="block text-[8px] text-dim uppercase">User UID</span>
                            <span className="text-muted break-all">{f.uid}</span>
                          </div>
                        )}
                      </div>

                      {f.type === "down" && f.issues && (
                        <div className="bg-bg/50 border border-border p-3 rounded-lg space-y-1">
                          <div className="font-mono text-[9px] uppercase font-bold text-rose-400">Reported issues & observations:</div>
                          <p className="text-xs text-text leading-relaxed font-sans">{f.issues}</p>
                        </div>
                      )}
                    </div>
                  ))}

                  {filteredFeedbacks.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-border rounded-xl bg-bg2/10">
                      <CheckCircle className="h-8 w-8 text-dim mx-auto mb-3" />
                      <p className="text-xs text-muted font-mono">No feedback logs match selected filters.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* tab 2: Views */}
            {activeTab === "views" && (
              <div className="bg-bg2/20 border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border bg-bg3/40 font-mono text-[10px] font-bold text-dim uppercase tracking-wider">
                  Lessons View Ranks (Aggregated)
                </div>
                <div className="divide-y divide-border/60">
                  {sortedLessonViews.map(({ lesson, count }, idx) => (
                    <div key={lesson} className="p-4 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-[10px] text-dim w-6 select-none">#{idx + 1}</span>
                        <span className="font-mono font-bold text-text truncate max-w-xl break-all">
                          {lesson}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-text font-bold">{count}</span>
                        <span className="text-dim text-[10px]">{count === 1 ? "view" : "views"}</span>
                      </div>
                    </div>
                  ))}

                  {sortedLessonViews.length === 0 && (
                    <div className="text-center py-16 text-xs text-muted font-mono">
                      No aggregated view logs recorded yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* tab 3: Simulators */}
            {activeTab === "simulators" && (
              <div className="bg-bg2/20 border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border bg-bg3/40 font-mono text-[10px] font-bold text-dim uppercase tracking-wider">
                  Simulator Interaction Ranks (Aggregated)
                </div>
                <div className="divide-y divide-border/60">
                  {sortedSimUsage.map(({ sim, count }, idx) => (
                    <div key={sim} className="p-4 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-[10px] text-dim w-6 select-none">#{idx + 1}</span>
                        <span className="font-mono font-bold text-text capitalize">
                          {sim.replace(/-/g, " ")} Simulator
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-accent font-bold">{count}</span>
                        <span className="text-dim text-[10px]">{count === 1 ? "interaction" : "interactions"}</span>
                      </div>
                    </div>
                  ))}

                  {sortedSimUsage.length === 0 && (
                    <div className="text-center py-16 text-xs text-muted font-mono">
                      No aggregated simulator interactions recorded yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
