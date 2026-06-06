"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ─── Ambient Particle Canvas ─────────────────────────────────────────────────
function AmbientParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef  = useRef({ x: 0, y: 0 });
  const animRef   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      size: number;
      alpha: number;
      text: string | null;
    }

    const particles: Particle[] = [];
    const texts = ["{ }", "< >", "0x", "=>"];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 50; i++) {
      particles.push({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        vx:    (Math.random() - 0.5) * 0.4,
        vy:    (Math.random() - 0.5) * 0.4,
        size:  Math.random() * 1.8 + 0.6,
        alpha: 0.12 + Math.random() * 0.14,
        text:  Math.random() > 0.85 ? texts[Math.floor(Math.random() * texts.length)] : null,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        const dx   = mouseRef.current.x - p.x;
        const dy   = mouseRef.current.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130 && dist > 0) {
          p.x -= (dx / dist) * 0.8;
          p.y -= (dy / dist) * 0.8;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = "var(--accent)";
        if (p.text) {
          ctx.font = "10px 'GeistMono', monospace";
          ctx.fillText(p.text, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("mousemove", handleMouse);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

// ─── Main HeroSection ─────────────────────────────────────────────────────────
export default function HeroSection() {
  return (
    <section
      className="relative w-full flex items-center border-b px-6 sm:px-10 lg:px-16"
      style={{
        minHeight: "88vh",
        paddingTop: "7rem",
        paddingBottom: "5rem",
        borderColor: "var(--border)",
      }}
    >
      {/* Particle field */}
      <AmbientParticleCanvas />

      {/* Soft accent glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 25% 55%, color-mix(in srgb, var(--accent) 5%, transparent), transparent)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-5xl">

        {/* Floating annotation — top, decorative only */}
        <p
          aria-hidden="true"
          className="absolute -top-8 left-0 font-mono text-[11px] hidden md:block select-none pointer-events-none"
          style={{ color: "#f59e0b", opacity: 0.32, transform: "rotate(-2deg)" }}
        >
          {`// "this confused me for weeks"`}
        </p>

        {/* ── Headline ── */}
        <h1 className="flex flex-col tracking-tight" style={{ lineHeight: 1.05 }}>

          {/* Web3 */}
          <span
            className="hero-reveal font-extrabold"
            style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", color: "var(--text)" }}
          >
            Web3
          </span>

          {/* explained — indented with margin, no translate */}
          <span
            className="hero-reveal hero-delay-1 font-medium italic"
            style={{
              fontSize: "clamp(2.2rem, 5.5vw, 4.8rem)",
              color: "var(--accent)",
              marginLeft: "clamp(1.5rem, 4vw, 4rem)",
              borderLeft: "4px solid var(--accent)",
              paddingLeft: "0.75rem",
              lineHeight: 1.1,
            }}
          >
            explained
          </span>

          {/* by someone who */}
          <span
            className="hero-reveal hero-delay-2 font-light"
            style={{
              fontSize: "clamp(1.8rem, 4.5vw, 3.8rem)",
              color: "var(--text-secondary)",
              lineHeight: 1.1,
            }}
          >
            by someone who
          </span>

          {/* recently got it. */}
          <span
            className="hero-reveal hero-delay-3 font-black tracking-tight"
            style={{
              fontSize: "clamp(3rem, 8.5vw, 6.5rem)",
              color: "var(--text)",
              lineHeight: 1.05,
              paddingBottom: "0.1em", /* prevent descender clip */
            }}
          >
            recently{" "}
            <span style={{ color: "var(--accent)" }}>got it.</span>
          </span>
        </h1>

        {/* ── Subtext ── */}
        <p
          className="hero-reveal hero-delay-4 text-base leading-relaxed max-w-lg"
          style={{
            color: "var(--text-secondary)",
            marginTop: "2rem",
            paddingLeft: "1.25rem",
            borderLeft: "1px solid var(--border2)",
          }}
        >
          8 progressive engineering tracks. Over 40 deep-dive modules.
          No superficial hand-waving. Every real system failure is fully documented.
        </p>

        {/* ── CTAs ── */}
        <div
          className="hero-reveal hero-delay-4 flex flex-col sm:flex-row gap-4"
          style={{ marginTop: "2.5rem" }}
        >
          <Link
            href="/learn/track-0"
            className="group relative overflow-hidden inline-flex items-center gap-2 rounded-lg px-7 py-3.5 font-mono text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--accent)",
              boxShadow: "0 4px 20px color-mix(in srgb, var(--accent) 25%, transparent)",
            }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
            />
            <span className="relative flex items-center gap-2">
              Begin Track 0 <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link
            href="/curriculum"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 font-mono text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-bg3"
            style={{
              border: "1px solid var(--border2)",
              color: "var(--text-secondary)",
            }}
          >
            Explore Curriculum
          </Link>
        </div>

        {/* Floating annotation — bottom, decorative only */}
        <p
          aria-hidden="true"
          className="absolute -bottom-8 left-32 font-mono text-[11px] hidden lg:block select-none pointer-events-none"
          style={{ color: "var(--text-dim)", opacity: 0.28, transform: "rotate(-1deg)" }}
        >
          {`// "why does failed tx still cost money 😭"`}
        </p>

      </div>
    </section>
  );
}
