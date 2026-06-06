"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ─── Ambient Particle Canvas ─────────────────────────────────────────────────
function AmbientParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check for accent color from CSS variable
    const accentLight = "124, 58, 237";   // #7c3aed  (light)
    const accentMid   = "139, 92, 246";   // #8b5cf6
    const accentDim   = "167, 139, 250";  // #a78bfa

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      size: number;
      colorIdx: number;
      text: string | null;
    }

    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const texts = ["{ }", "< >", "0x", "=>"];

    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2 + 0.8,
        colorIdx: Math.floor(Math.random() * 3),
        text: Math.random() > 0.82 ? texts[Math.floor(Math.random() * texts.length)] : null,
      });
    }

    const colorMap = [accentLight, accentMid, accentDim];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Mouse repulsion
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140 && dist > 0) {
          p.x -= (dx / dist) * 0.9;
          p.y -= (dy / dist) * 0.9;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const rgb = colorMap[p.colorIdx];
        ctx.globalAlpha = 0.28;
        ctx.fillStyle = `rgba(${rgb}, 1)`;

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
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70"
      aria-hidden="true"
    />
  );
}

// ─── Terminal Stream ──────────────────────────────────────────────────────────
const TERMINAL_COMMANDS = [
  "> FETCHING BLOCKS...",
  "> VERIFYING HASH",
  "> SYNC COMPLETE",
  "> AWAITING INPUT",
  "> DEPLOYING CONTRACT",
  "> GAS ESTIMATE: LOW",
  "> EVM: FRAME READY",
  "> SNARK WITNESS GEN",
];

function TerminalStream() {
  const [lines, setLines] = useState([
    "> INIT SEQ_01",
    "> LOAD CORE_MOD",
    "> SYNC PENDING",
  ]);
  const cmdIdxRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      setLines((prev) => {
        const next = [...prev];
        if (next.length >= 3) next.shift();
        next.push(TERMINAL_COMMANDS[cmdIdxRef.current % TERMINAL_COMMANDS.length]);
        cmdIdxRef.current++;
        return next;
      });
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hero-terminal-stream flex flex-col gap-1 font-mono text-[10px] text-muted">
      {lines.map((line, i) => (
        <span key={i} style={{ opacity: 0.5 + i * 0.2 }}>
          {line}
        </span>
      ))}
    </div>
  );
}

// ─── Epoch Clock ─────────────────────────────────────────────────────────────
function EpochClock() {
  const [epoch, setEpoch] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const id = setInterval(() => setEpoch(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hidden md:flex flex-col gap-0.5 items-end self-end">
      <span
        className="font-mono uppercase tracking-widest"
        style={{ fontSize: "10px", color: "var(--text-dim)" }}
      >
        CURRENT EPOCH
      </span>
      <span
        className="font-mono text-sm font-medium tabular-nums"
        style={{ color: "var(--accent)" }}
      >
        {epoch}
      </span>
      {/* Tiny sparkline decoration */}
      <svg className="mt-1 opacity-40" width="40" height="20" viewBox="0 0 40 20">
        <polyline
          fill="none"
          points="0,15 10,5 20,18 30,8 40,12"
          stroke="var(--accent)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

// ─── Main HeroSection Component ───────────────────────────────────────────────
export default function HeroSection() {
  return (
    <section
      className="hero-section relative w-full min-h-[90vh] flex flex-col justify-center overflow-hidden border-b px-4 pb-16 pt-28 sm:px-6 lg:px-12"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Ambient particle canvas */}
      <AmbientParticleCanvas />

      {/* Organic blurred background blob — uses accent colour */}
      <div
        aria-hidden="true"
        className="hero-organic-blob absolute pointer-events-none z-0"
        style={{
          top: "5%",
          left: "-8%",
          width: "75%",
          height: "110%",
          opacity: 0.04,
          mixBlendMode: "multiply",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M856.5,232.5 C948.1,385.9 986.9,598.7 912.2,746.5 C837.5,894.3 649.3,977.1 465.1,971.9 C280.9,966.7 100.7,873.5 35.5,720.3 C-29.7,567.1 -9.9,353.9 83.9,206.7 C177.7,59.5 345.5,-21.7 521.3,4.1 C697.1,29.9 764.9,79.1 856.5,232.5 Z"
            fill="var(--accent)"
          />
        </svg>
      </div>

      {/* Ambient glow blob */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      >
        <div
          className="rounded-full blur-[120px]"
          style={{
            width: "700px",
            height: "420px",
            backgroundColor: "var(--accent)",
            opacity: 0.04,
          }}
        />
      </div>

      {/* Content grid */}
      <div className="relative z-10 mx-auto max-w-7xl w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">

          {/* ── LEFT MARGINALIA ───────────────────────────── */}
          <aside className="hidden lg:flex flex-col gap-6 lg:col-span-2 mt-24 hero-reveal hero-delay-3">
            <div
              className="font-mono text-[10px] uppercase tracking-widest leading-tight pl-4 py-1"
              style={{
                borderLeft: "2px solid var(--accent)",
                color: "var(--text-dim)",
                opacity: 0.7,
              }}
            >
              Fig. 1.0<br />Conceptual Framework
            </div>

            {/* Mini terminal panel */}
            <div
              className="rounded-lg p-4 w-full"
              style={{
                background: "color-mix(in srgb, var(--bg2) 80%, transparent)",
                backdropFilter: "blur(10px)",
                border: "1px solid var(--border)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: "#ef4444" }}
                />
                <span
                  className="font-mono text-[10px] font-bold uppercase"
                  style={{ color: "var(--accent)" }}
                >
                  SYSTEM_STATE
                </span>
              </div>
              <TerminalStream />
            </div>
          </aside>

          {/* ── MAIN HEADLINE BLOCK ───────────────────────── */}
          <div className="lg:col-span-7 flex flex-col relative">

            {/* Floating annotation — confused comment */}
            <div
              className="absolute -top-10 left-4 font-mono text-[11px] font-semibold hidden md:block select-none opacity-40 hover:opacity-80 transition-opacity duration-300"
              style={{ color: "#f59e0b", transform: "rotate(-3deg)" }}
            >
              {`// "this confused me for weeks"`}
            </div>

            {/* Monospace status badge */}
            <div
              className="mb-8 inline-flex self-start items-center gap-2.5 rounded-full px-3.5 py-2 font-mono text-[10px]"
              style={{
                border: "1px solid var(--border2)",
                background: "color-mix(in srgb, var(--bg2) 60%, transparent)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <span style={{ color: "var(--text-dim)" }}>BUILD_STATUS:</span>
              <span className="font-semibold" style={{ color: "var(--accent)" }}>
                TRACK_0_LIVE
              </span>
            </div>

            {/* ── Cinematic Staggered Headline ── */}
            <h1 className="flex flex-col relative tracking-tight leading-none">
              {/* "Web3" */}
              <span
                className="hero-reveal font-extrabold -ml-1"
                style={{
                  fontSize: "clamp(3rem, 8vw, 6rem)",
                  color: "var(--text)",
                }}
              >
                Web3
              </span>

              {/* "explained" — accent italic offset */}
              <span
                className="hero-reveal hero-delay-1 font-medium italic transform -translate-y-2 translate-x-6 inline-block w-max px-2"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  color: "var(--accent)",
                  backdropFilter: "blur(4px)",
                  borderLeft: "4px solid var(--accent)",
                  background: "color-mix(in srgb, var(--bg) 85%, transparent)",
                }}
              >
                explained
              </span>

              {/* "by someone who" — light weight */}
              <span
                className="hero-reveal hero-delay-2 font-light transform -translate-y-4"
                style={{
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  color: "var(--text-secondary)",
                }}
              >
                by someone who
              </span>

              {/* "recently got it." — heavy weight with gradient */}
              <span
                className="hero-reveal hero-delay-3 font-black tracking-tight transform -translate-y-6 relative z-10"
                style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)", color: "var(--text)" }}
              >
                recently{" "}
                <span
                  className="relative inline-block"
                  style={{
                    background: "linear-gradient(135deg, var(--accent) 0%, #a78bfa 50%, #22d3ee 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  got it.
                  <span
                    className="absolute bottom-1 left-0 w-full rounded"
                    style={{
                      height: "3px",
                      background: "linear-gradient(90deg, var(--accent), #22d3ee)",
                    }}
                  />
                </span>
              </span>
            </h1>

            {/* ── Subtext + Epoch clock row ── */}
            <div
              className="hero-reveal hero-delay-4 flex flex-col lg:flex-row items-start gap-10 mt-6 ml-0 lg:ml-20"
            >
              <p
                className="text-base leading-relaxed max-w-lg pl-5"
                style={{
                  color: "var(--text-secondary)",
                  borderLeft: "1px solid var(--border2)",
                }}
              >
                8 progressive engineering tracks. Over 40 deep-dive modules.
                No superficial hand-waving explanations. Every real system failure is fully documented.
              </p>
              <EpochClock />
            </div>

            {/* ── CTAs ── */}
            <div
              className="hero-reveal hero-delay-4 flex flex-col sm:flex-row items-center gap-5 mt-14 ml-0 lg:ml-28 relative z-20"
            >
              <Link
                href="/learn/track-0"
                className="hero-btn-primary group relative w-full sm:w-auto overflow-hidden inline-flex items-center gap-2 rounded-lg px-8 py-4 font-mono text-sm font-bold tracking-widest uppercase text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "var(--accent)",
                  boxShadow: "0 8px 24px color-mix(in srgb, var(--accent) 30%, transparent)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  BEGIN TRACK 0
                  <ArrowRight className="h-4 w-4" />
                </span>
                {/* Hover fill overlay */}
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                  style={{
                    background: "linear-gradient(135deg, #5b21b6, #4c1d95)",
                  }}
                />
              </Link>

              <Link
                href="/curriculum"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 font-mono text-sm font-bold tracking-widest uppercase transition-all duration-200 hover:-translate-y-0.5 hover:border-opacity-80"
                style={{
                  border: "2px solid var(--border2)",
                  color: "var(--text)",
                  background: "color-mix(in srgb, var(--bg2) 50%, transparent)",
                  backdropFilter: "blur(6px)",
                }}
              >
                EXPLORE CURRICULUM
              </Link>
            </div>

            {/* ── Telemetry footer row ── */}
            <div
              className="hero-reveal hero-delay-4 mt-12 font-mono flex flex-wrap gap-x-6 gap-y-2 pt-5 opacity-40 hover:opacity-80 transition-opacity duration-300"
              style={{
                fontSize: "10px",
                color: "var(--text-dim)",
                borderTop: "1px solid var(--border)",
              }}
            >
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                PEERS_ONLINE: 40_LIVE
              </span>
              <span>LATENCY: 42ms</span>
              <span>GAS_EST: 18_GWEI</span>
              <span>RECON: ACTIVE</span>
            </div>

            {/* Floating annotation — bottom */}
            <div
              className="absolute -bottom-8 left-28 font-mono text-[11px] font-semibold hidden md:block select-none opacity-35 hover:opacity-75 transition-opacity duration-300"
              style={{ color: "#a78bfa", transform: "rotate(-1.5deg)" }}
            >
              {`// "why does failed tx still cost money 😭"`}
            </div>
          </div>

          {/* ── RIGHT MARGINALIA ──────────────────────────── */}
          <aside className="hidden xl:flex flex-col gap-10 lg:col-span-3 mt-auto mb-28 items-end text-right hero-reveal hero-delay-4">
            {/* Spinning dashed ring */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center relative"
              style={{
                border: "1px dashed var(--border2)",
                animation: "spin 22s linear infinite",
              }}
            >
              <div
                className="absolute top-0 -mt-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--accent)" }}
              />
            </div>

            <div
              className="font-mono"
              style={{ fontSize: "10px", color: "var(--text-dim)" }}
            >
              Coordinates
              <br />
              <span style={{ color: "var(--text)" }}>45.02° N, 12.44° E</span>
            </div>

            {/* Mini "right panel" — status chips */}
            <div className="flex flex-col gap-2 items-end">
              {[
                { label: "EVM", status: "READY", ok: true },
                { label: "RPC", status: "LIVE",  ok: true },
                { label: "GAS", status: "LOW",   ok: true },
              ].map(({ label, status, ok }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full px-3 py-1"
                  style={{
                    border: "1px solid var(--border)",
                    background: "color-mix(in srgb, var(--bg2) 70%, transparent)",
                    fontSize: "9px",
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: ok ? "#22c55e" : "#ef4444",
                    }}
                  />
                  <span className="font-mono" style={{ color: "var(--text-dim)" }}>
                    {label}
                  </span>
                  <span className="font-mono font-bold" style={{ color: "var(--text)" }}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </aside>

        </div>
      </div>
    </section>
  );
}
