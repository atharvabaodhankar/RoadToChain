import { Metadata } from "next";
import { notFound } from "next/navigation";
import { tracks } from "@/lib/curriculum";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Star, Clock } from "lucide-react";
import fs from "fs";
import path from "path";
import TrackProgressBar from "@/components/layout/TrackProgressBar";
import LessonStatusBadge from "@/components/layout/LessonStatusBadge";


interface Props {
  params: Promise<{
    trackSlug: string;
  }>;
}

export async function generateStaticParams() {
  return tracks.map((track) => ({
    trackSlug: track.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { trackSlug } = await params;
  const track = tracks.find((t) => t.slug === trackSlug);

  if (!track) {
    return {
      title: "Track Not Found",
    };
  }

  return {
    title: `${track.number}: ${track.name} — LearnBlockchain`,
    description: track.description,
  };
}

export default async function TrackPage({ params }: Props) {
  const { trackSlug } = await params;
  const track = tracks.find((t) => t.slug === trackSlug);

  if (!track) {
    notFound();
  }

  const trackIndex = tracks.findIndex((t) => t.slug === trackSlug);
  const nextTrack = trackIndex < tracks.length - 1 ? tracks[trackIndex + 1] : null;
  const prevTrack = trackIndex > 0 ? tracks[trackIndex - 1] : null;

  return (
    <div className="min-h-screen bg-bg text-text pb-24">
      {/* ── Top Navigation Bar ──────────────────────────────────── */}
      <div className="border-b border-border bg-bg2 px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/curriculum"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-text transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Curriculum
          </Link>
          <div className="font-mono text-xs text-dim">
            Track {trackIndex + 1} of 8
          </div>
        </div>
      </div>

      {/* ── Track Header ────────────────────────────────────────── */}
      <header className="relative border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="h-[250px] w-[500px] rounded-full opacity-10 blur-[100px]"
            style={{ backgroundColor: track.color }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-dim">
              {track.number}
            </span>
            <span
              className="rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider border"
              style={{
                color: track.color,
                borderColor: `${track.color}30`,
                backgroundColor: `${track.color}10`,
              }}
            >
              {track.difficulty}
            </span>
            {track.isSignature && (
              <span className="inline-flex items-center gap-1 rounded bg-accent/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-accent border border-accent/30">
                <Star className="h-3 w-3 fill-accent" /> Signature Track
              </span>
            )}
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
            {track.name}
          </h1>
          <p className="mt-4 font-mono text-base text-[#a78bfa] tracking-tight">
            {track.tagline}
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {track.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-4 border-t border-border/30 pt-6 font-mono text-xs text-dim">
            <div>
              Modules: <span className="text-text font-bold">{track.moduleCount}</span>
            </div>
            <div>
              Lessons: <span className="text-text font-bold">{track.lessonCount}</span>
            </div>
            <div>
              Duration: <span className="text-text font-bold">~{track.estimatedHours}h</span>
            </div>
            {track.prerequisites.length > 0 && (
              <div>
                Prerequisites:{" "}
                <span className="text-text font-bold">
                  {track.prerequisites.map((p) => `Track ${p}`).join(" + ")}
                </span>
              </div>
            )}
          </div>
          <TrackProgressBar
            trackSlug={track.slug}
            totalLessons={track.lessonCount}
            trackColor={track.color}
          />
        </div>
      </header>

      {/* ── Capstone Hero Project ────────────────────────────────── */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-xl border border-accent/20 bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <Star className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
                Capstone Project built in this track
              </span>
              <h2 className="mt-1 font-sans text-base font-semibold tracking-tight text-text">
                {track.heroProject.name}
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                {track.heroProject.description}
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
                <span className="font-mono text-[10px] text-dim">
                  Every lesson feeds directly into this codebase.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modules List ────────────────────────────────────────── */}
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-12">
          {track.modules.map((mod) => (
            <div key={mod.id} className="relative">
              {/* Module Header */}
              <div className="flex items-start gap-4 border-b border-border pb-4">
                <div className="font-mono text-sm font-bold text-accent">
                  {mod.number}
                </div>
                <div>
                  <h3 className="font-sans text-base font-semibold tracking-tight text-text">
                    {mod.name}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {mod.description}
                  </p>
                </div>
              </div>

              {/* Module Lessons Grid */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {mod.lessons.map((lesson) => {
                  const moduleSlug = `module-${mod.number.split(".")[1]}`;
                  // Check dynamically if the MDX file exists on disk
                  const filePath = path.join(
                    process.cwd(),
                    "content",
                    track.slug,
                    moduleSlug,
                    `${lesson.slug}.mdx`
                  );
                  const isImplemented = fs.existsSync(filePath);

                  const href = `/learn/${track.slug}/${moduleSlug}/${lesson.slug}`;

                  return (
                    <div
                      key={lesson.slug}
                      className={`group relative rounded-xl border p-4 transition-all duration-200 ${
                        isImplemented
                          ? "border-border bg-bg2 hover:border-border2 hover:bg-bg3 cursor-pointer"
                          : "border-border/40 bg-bg/50 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-sans text-xs font-semibold text-text group-hover:text-[#a78bfa] transition-colors leading-snug">
                          {lesson.title}
                        </h4>
                        {isImplemented ? (
                          <LessonStatusBadge
                            trackSlug={track.slug}
                            moduleSlug={moduleSlug}
                            lessonSlug={lesson.slug}
                            trackColor={track.color}
                          />
                        ) : (
                          <span className="rounded bg-bg4 px-1.5 py-0.5 font-mono text-[9px] text-dim border border-border/50 shrink-0">
                            Upcoming
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted line-clamp-2">
                        {lesson.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 font-mono text-[10px] text-dim">
                            <Clock className="h-3 w-3" /> {lesson.estimatedMinutes}m
                          </span>
                        </div>

                        {isImplemented && (
                          <Link
                            href={href}
                            className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-accent"
                          >
                            Read <ArrowRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ── Navigation Footer ────────────────────────────────────── */}
      <section className="mt-16 border-t border-border px-4 py-12 sm:px-6 lg:px-8 bg-bg2">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          {prevTrack ? (
            <Link
              href={`/learn/${prevTrack.slug}`}
              className="group flex flex-col items-start gap-1"
            >
              <span className="font-mono text-[10px] text-dim uppercase">Previous Track</span>
              <span className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-muted group-hover:text-text transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> {prevTrack.name}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextTrack ? (
            <Link
              href={`/learn/${nextTrack.slug}`}
              className="group flex flex-col items-end gap-1"
            >
              <span className="font-mono text-[10px] text-dim uppercase">Next Track</span>
              <span className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-accent group-hover:text-accent2 transition-colors">
                {nextTrack.name} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
    </div>
  );
}
