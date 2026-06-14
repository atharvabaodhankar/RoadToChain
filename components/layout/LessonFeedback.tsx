"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Send, CheckCircle2 } from "lucide-react";
import { useProgress } from "@/app/context/ProgressContext";
import { submitFeedback } from "@/lib/firebase";

interface LessonFeedbackProps {
  trackSlug: string;
  moduleSlug: string;
  lessonSlug: string;
}

export default function LessonFeedback({
  trackSlug,
  moduleSlug,
  lessonSlug,
}: LessonFeedbackProps) {
  const { user } = useProgress();
  const [submitted, setSubmitted] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"up" | "down" | null>(null);
  const [issues, setIssues] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleThumbsUp = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await submitFeedback({
        uid: user ? user.uid : null,
        email: user ? user.email : null,
        trackSlug,
        moduleSlug,
        lessonSlug,
        type: "up",
        timestamp: Date.now(),
      });
      setSubmitted(true);
      setFeedbackType("up");
    } catch {
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleThumbsDownInit = () => {
    setFeedbackType("down");
  };

  const handleThumbsDownSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issues.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitFeedback({
        uid: user ? user.uid : null,
        email: user ? user.email : null,
        trackSlug,
        moduleSlug,
        lessonSlug,
        type: "down",
        issues: issues.trim(),
        timestamp: Date.now(),
      });
      setSubmitted(true);
    } catch {
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="my-8 rounded-xl border border-border bg-bg2/40 p-5 flex items-center gap-3 text-xs select-none">
        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
        <div>
          <span className="font-bold text-text">Thank you for your feedback!</span>
          <p className="text-muted text-[10px] mt-0.5">Your response helps us improve the curriculum for everyone.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 rounded-xl border border-border bg-bg2/30 p-5 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-text">Was this lesson helpful?</h4>
          <p className="text-[10px] text-muted mt-0.5">
            Let us know what you think of this specification. {user?.email ? `(submitting as ${user.email})` : "(submitting anonymously)"}
          </p>
        </div>

        {feedbackType !== "down" && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleThumbsUp}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg hover:border-emerald-500/30 hover:bg-emerald-500/5 px-3 py-1.5 text-xs text-muted hover:text-emerald-500 transition-all cursor-pointer"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>Yes</span>
            </button>
            <button
              onClick={handleThumbsDownInit}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg hover:border-rose-500/30 hover:bg-rose-500/5 px-3 py-1.5 text-xs text-muted hover:text-rose-500 transition-all cursor-pointer"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              <span>No</span>
            </button>
          </div>
        )}
      </div>

      {feedbackType === "down" && (
        <form onSubmit={handleThumbsDownSubmit} className="mt-4 border-t border-border/40 pt-4 space-y-3">
          <div className="space-y-1">
            <label htmlFor="issues" className="block font-mono text-[9px] font-bold uppercase tracking-wider text-muted">
              What issues did you find in this lesson?
            </label>
            <textarea
              id="issues"
              rows={3}
              value={issues}
              onChange={(e) => setIssues(e.target.value)}
              placeholder="E.g., code bug, typo, confusing explanation, simulator issue..."
              required
              className="w-full rounded-lg border border-border bg-bg p-2.5 text-xs text-text placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setFeedbackType(null)}
              className="font-mono text-[9px] text-dim hover:text-text transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !issues.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent hover:bg-accent-hover px-3.5 py-2 font-mono text-[10px] font-bold text-white transition-all cursor-pointer disabled:opacity-55"
            >
              <Send className="h-3 w-3" />
              <span>{submitting ? "Submitting..." : "Submit Feedback"}</span>
            </button>
          </div>
        </form>
      )}

      {error && (
        <p className="mt-2 text-rose-500 text-[10px] font-mono">{error}</p>
      )}
    </div>
  );
}
