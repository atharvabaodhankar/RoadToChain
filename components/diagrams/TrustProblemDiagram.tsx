"use client";

import { useState } from "react";

type Hover = null | "bank" | "network";

const USERS = ["Alice", "Bob", "Charlie", "Dave"];
const NODE_POSITIONS = [
  { cx: 72, cy: 80 },
  { cx: 328, cy: 80 },
  { cx: 72, cy: 270 },
  { cx: 328, cy: 270 },
];
const BANK = { cx: 200, cy: 175 };

const NET_POSITIONS = [
  { cx: 60, cy: 80 },
  { cx: 320, cy: 80 },
  { cx: 60, cy: 270 },
  { cx: 320, cy: 270 },
  { cx: 190, cy: 175 },
];
const NET_EDGES = [
  [0, 1], [0, 2], [0, 4],
  [1, 3], [1, 4],
  [2, 3], [2, 4],
  [3, 4],
];

export default function TrustProblemDiagram() {
  const [hovered, setHovered] = useState<Hover>(null);

  const bankFail = hovered === "bank";
  const netActive = hovered === "network";

  return (
    <div className="not-prose my-8 rounded-xl border overflow-hidden" style={{ borderColor: "var(--dg-border)", background: "var(--dg-bg)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--dg-border)" }}>
        <span className="font-mono text-[11px] tracking-widest uppercase" style={{ color: "var(--dg-text-dim)" }}>
          T0.1 — Trust Problem
        </span>
        <span className="font-mono text-[10px]" style={{ color: "var(--dg-text-faint)" }}>
          hover to explore
        </span>
      </div>

      {/* Diagram grid */}
      <div className="grid grid-cols-2 divide-x divide-border">

        {/* LEFT — Centralized */}
        <div
          className="relative p-4 cursor-pointer transition-all duration-300"
          style={{ background: bankFail ? "rgba(220,38,38,0.03)" : "transparent" }}
          onMouseEnter={() => setHovered("bank")}
          onMouseLeave={() => setHovered(null)}
        >
          <p className="font-mono text-[10px] tracking-widest uppercase mb-3 text-center" style={{ color: bankFail ? "var(--dg-danger)" : "var(--dg-text-dim)" }}>
            Centralized
          </p>
          <svg viewBox="0 0 400 350" className="w-full h-auto">
            {/* Lines from users to bank */}
            {NODE_POSITIONS.map((n, i) => (
              <line
                key={i}
                x1={n.cx} y1={n.cy}
                x2={BANK.cx} y2={BANK.cy}
                stroke={bankFail ? "var(--dg-danger)" : "var(--dg-border)"}
                strokeWidth={bankFail ? 1.5 : 1}
                strokeDasharray={bankFail ? "4 3" : "3 3"}
                style={{ transition: "all 0.3s" }}
              />
            ))}

            {/* Central Bank */}
            <rect
              x={BANK.cx - 55} y={BANK.cy - 26}
              width={110} height={52}
              rx={7}
              fill={bankFail ? "rgba(220,38,38,0.08)" : "var(--dg-card)"}
              stroke={bankFail ? "var(--dg-danger)" : "var(--dg-accent)"}
              strokeWidth={bankFail ? 2 : 1.5}
              style={{ transition: "all 0.3s" }}
            />
            <text x={BANK.cx} y={BANK.cy - 6} textAnchor="middle" fontSize={11} fontWeight="600" fontFamily="monospace" style={{ fill: bankFail ? "var(--dg-danger)" : "var(--dg-text)" }}>
              Central Bank
            </text>
            <text x={BANK.cx} y={BANK.cy + 12} textAnchor="middle" fontSize={9} fontFamily="monospace" style={{ fill: "var(--dg-text-dim)" }}>
              {bankFail ? "⚠ single point" : "trust intermediary"}
            </text>

            {/* User nodes */}
            {NODE_POSITIONS.map((n, i) => (
              <g key={i}>
                <circle cx={n.cx} cy={n.cy} r={28}
                  fill="var(--dg-card)"
                  stroke={bankFail ? "rgba(220,38,38,0.3)" : "var(--dg-border)"}
                  strokeWidth={1}
                  style={{ transition: "all 0.3s" }}
                />
                <text x={n.cx} y={n.cy + 4} textAnchor="middle" fontSize={11} fontFamily="monospace"
                  style={{ fill: bankFail ? "var(--dg-text-dim)" : "var(--dg-text)" }}>
                  {USERS[i]}
                </text>
              </g>
            ))}

            {/* Failure badge */}
            {bankFail && (
              <g>
                <rect x={BANK.cx - 72} y={BANK.cy + 34} width={144} height={22} rx={4}
                  fill="rgba(220,38,38,0.12)" stroke="rgba(220,38,38,0.4)" strokeWidth={1} />
                <text x={BANK.cx} y={BANK.cy + 49} textAnchor="middle" fontSize={9} fontFamily="monospace" style={{ fill: "var(--dg-danger)" }}>
                  SINGLE POINT OF FAILURE
                </text>
              </g>
            )}
          </svg>

          {/* Label */}
          <div className="text-center mt-1">
            <span className="font-mono text-[10px]" style={{ color: bankFail ? "var(--dg-danger)" : "var(--dg-text-faint)" }}>
              {bankFail ? "⚠ If bank fails — everyone fails" : "Single Point of Trust"}
            </span>
          </div>
        </div>

        {/* RIGHT — Distributed */}
        <div
          className="relative p-4 cursor-pointer transition-all duration-300"
          style={{ background: netActive ? "rgba(124,58,237,0.03)" : "transparent" }}
          onMouseEnter={() => setHovered("network")}
          onMouseLeave={() => setHovered(null)}
        >
          <p className="font-mono text-[10px] tracking-widest uppercase mb-3 text-center" style={{ color: netActive ? "var(--dg-accent)" : "var(--dg-text-dim)" }}>
            Distributed
          </p>
          <svg viewBox="0 0 400 350" className="w-full h-auto">
            {/* Mesh edges */}
            {NET_EDGES.map(([a, b], i) => (
              <line
                key={i}
                x1={NET_POSITIONS[a].cx} y1={NET_POSITIONS[a].cy}
                x2={NET_POSITIONS[b].cx} y2={NET_POSITIONS[b].cy}
                stroke={netActive ? "var(--dg-accent)" : "var(--dg-border)"}
                strokeWidth={netActive ? 1.5 : 1}
                style={{ transition: "all 0.3s" }}
              />
            ))}

            {/* Nodes */}
            {NET_POSITIONS.map((n, i) => (
              <g key={i}>
                <rect
                  x={n.cx - 32} y={n.cy - 20}
                  width={64} height={40}
                  rx={6}
                  fill="var(--dg-card)"
                  stroke={netActive ? "var(--dg-accent)" : "var(--dg-border)"}
                  strokeWidth={netActive ? 1.5 : 1}
                  style={{ transition: "all 0.3s" }}
                />
                <text x={n.cx} y={n.cy - 4} textAnchor="middle" fontSize={9} fontFamily="monospace" style={{ fill: "var(--dg-text-dim)" }}>
                  {i < 4 ? "Node" : ""}
                </text>
                <text x={n.cx} y={n.cy + 10} textAnchor="middle" fontSize={10} fontWeight="600" fontFamily="monospace" style={{ fill: netActive ? "var(--dg-accent)" : "var(--dg-text)" }}>
                  {i === 4 ? "Hub" : String.fromCharCode(65 + i)}
                </text>
              </g>
            ))}

            {/* Verification badges */}
            {netActive && NET_POSITIONS.slice(0, 4).map((n, i) => (
              <g key={i}>
                <rect x={n.cx - 22} y={n.cy + 24} width={44} height={15} rx={3}
                  fill="rgba(124,58,237,0.12)" stroke="rgba(124,58,237,0.4)" strokeWidth={1} />
                <text x={n.cx} y={n.cy + 35} textAnchor="middle" fontSize={7.5} fontFamily="monospace" style={{ fill: "var(--dg-accent)" }}>
                  verified
                </text>
              </g>
            ))}
          </svg>

          <div className="text-center mt-1">
            <span className="font-mono text-[10px]" style={{ color: netActive ? "var(--dg-accent)" : "var(--dg-text-faint)" }}>
              {netActive ? "✓ Shared Verification — no single owner" : "Shared Verification"}
            </span>
          </div>
        </div>
      </div>

      {/* Footer insight */}
      <div className="px-5 py-3 border-t font-mono text-[10px] text-center" style={{ borderColor: "var(--dg-border)", color: "var(--dg-text-dim)" }}>
        Hover left to see the failure mode · Hover right to see how decentralization solves it
      </div>
    </div>
  );
}
