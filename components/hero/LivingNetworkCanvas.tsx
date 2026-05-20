"use client";

import { useEffect, useRef } from "react";

interface NetworkNode {
  id: number;
  // Chaos layout (Phase 1)
  cRatioX: number;
  cRatioY: number;
  // Distributed Mesh layout (Phase 2)
  fRatioX: number;
  fRatioY: number;
  // Aligned Blockchain layout (Phase 3)
  mRatioX: number;
  mRatioY: number;

  x: number;
  y: number;
  size: number;
  pulsePhase: number;
  pulseSpeed: number;
  driftOffset: number;
}

export default function LivingNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false, targetX: 0, targetY: 0 });
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    const nodes: NetworkNode[] = [];
    const nodeCount = 40;

    // Helper to calculate high-DPI sizing
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Initialize layout coordinates (ratios 0.0 to 1.0)
    for (let i = 0; i < nodeCount; i++) {
      // 1. Phase 1 (Chaos): Completely scattered, irregular
      const cRatioX = 0.1 + Math.random() * 0.8;
      const cRatioY = 0.15 + Math.random() * 0.7;

      // 2. Phase 2 (Distributed Mesh): Standard distributed clusters
      let fRatioX = 0.5;
      let fRatioY = 0.5;
      if (i === 0) {
        // Central core hub
        fRatioX = 0.5;
        fRatioY = 0.45;
      } else if (i < 6) {
        // Core layer rings
        const angle = (i / 5) * Math.PI * 2;
        fRatioX = 0.5 + Math.cos(angle) * 0.18;
        fRatioY = 0.45 + Math.sin(angle) * 0.22;
      } else if (i < 18) {
        // Secondary nodes branching out
        const clusterId = i % 5;
        const angle = (clusterId / 5) * Math.PI * 2 + (i * 0.15);
        fRatioX = 0.5 + Math.cos(angle) * 0.32;
        fRatioY = 0.45 + Math.sin(angle) * 0.35;
      } else {
        // Distant perimeter validators
        const angle = Math.random() * Math.PI * 2;
        fRatioX = 0.5 + Math.cos(angle) * (0.4 + Math.random() * 0.08);
        fRatioY = 0.45 + Math.sin(angle) * (0.4 + Math.random() * 0.08);
      }

      // 3. Phase 3 (Structured Blockchain System): Highly aligned, block segments and rings
      let mRatioX = 0.5;
      let mRatioY = 0.5;
      if (i < 12) {
        // Perfect Validator Circle
        const angle = (i / 12) * Math.PI * 2;
        mRatioX = 0.5 + Math.cos(angle) * 0.18;
        mRatioY = 0.45 + Math.sin(angle) * 0.25;
      } else if (i < 28) {
        // Clean linear block sequence connected at the bottom (nodes 12 to 27 form 4 blocks)
        const blockIndex = Math.floor((i - 12) / 4); // 0, 1, 2, 3
        const blockPosInSquare = (i - 12) % 4; // 0, 1, 2, 3

        const blockSpacing = 0.18;
        const startX = 0.22;
        const baseY = 0.8;

        const xOffset = startX + blockIndex * blockSpacing;
        const yOffset = baseY;

        // Position square vertices
        if (blockPosInSquare === 0) { mRatioX = xOffset; mRatioY = yOffset; }
        else if (blockPosInSquare === 1) { mRatioX = xOffset + 0.06; mRatioY = yOffset; }
        else if (blockPosInSquare === 2) { mRatioX = xOffset + 0.06; mRatioY = yOffset + 0.08; }
        else if (blockPosInSquare === 3) { mRatioX = xOffset; mRatioY = yOffset + 0.08; }
      } else {
        // Isolated top telemetry orbits
        const topIdx = i - 28;
        mRatioX = 0.15 + topIdx * 0.07;
        mRatioY = 0.15 + (topIdx % 2 === 0 ? 0.03 : 0);
      }

      nodes.push({
        id: i,
        cRatioX,
        cRatioY,
        fRatioX,
        fRatioY,
        mRatioX,
        mRatioY,
        x: width * cRatioX,
        y: height * cRatioY,
        size: 1.5 + Math.random() * 2,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        driftOffset: Math.random() * 1000,
      });
    }

    // Capture mouse coordinate interactions passively
    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = mouseEvent.clientX - rect.left;
      mouseRef.current.targetY = mouseEvent.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const parent = canvas.parentElement || window;
    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);

    // Passive scroll monitoring for coordinate morphing triggers
    const handleScroll = () => {
      // Morph between layouts over 400px of scrolling
      const progress = Math.min(window.scrollY / 400, 1);
      scrollProgressRef.current = progress;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    let time = 0;

    // Decoupled Draw & Physics Loop (Runs on separate frame requests, zero React overhead)
    const draw = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      const p = scrollProgressRef.current; // 0 to 1 scroll progression

      // Smoothly LERP mouse positions to avoid coordinate jumps
      const mxRef = mouseRef.current;
      mxRef.x += (mxRef.targetX - mxRef.x) * 0.1;
      mxRef.y += (mxRef.targetY - mxRef.y) * 0.1;

      // Update positions based on active layout interpolation
      nodes.forEach((node) => {
        let targetRatioX = 0;
        let targetRatioY = 0;

        if (p < 0.5) {
          // Morph between Phase 1 (Chaos) and Phase 2 (Distributed Web)
          const t = p / 0.5;
          targetRatioX = node.cRatioX + t * (node.fRatioX - node.cRatioX);
          targetRatioY = node.cRatioY + t * (node.fRatioY - node.cRatioY);
        } else {
          // Morph between Phase 2 (Distributed Web) and Phase 3 (Structured Blockchain)
          const t = (p - 0.5) / 0.5;
          targetRatioX = node.fRatioX + t * (node.mRatioX - node.fRatioX);
          targetRatioY = node.fRatioY + t * (node.mRatioY - node.fRatioY);
        }

        const targetX = width * targetRatioX;
        const targetY = height * targetRatioY;

        // Apply background drift physics (extremely subtle to maintain calm engineered restraint)
        const driftScale = 1.2 * (1 - p);
        const driftX = Math.sin(time * 0.008 + node.driftOffset) * driftScale;
        const driftY = Math.cos(time * 0.008 + node.driftOffset * 1.3) * driftScale;

        let finalTargetX = targetX + driftX;
        let finalTargetY = targetY + driftY;

        // Cursor attraction / proximity bend physics
        if (mxRef.active) {
          const dx = finalTargetX - mxRef.x;
          const dy = finalTargetY - mxRef.y;
          const dist = Math.hypot(dx, dy);
          const activeRadius = 160;

          if (dist < activeRadius) {
            const force = (activeRadius - dist) / activeRadius;
            // Pull nodes slightly towards the cursor to create real physical texture
            finalTargetX -= (dx / dist) * force * 15;
            finalTargetY -= (dy / dist) * force * 15;
          }
        }

        // LERP nodes positions at high frame rate
        node.x += (finalTargetX - node.x) * 0.08;
        node.y += (finalTargetY - node.y) * 0.08;

        // Update pulse phase
        node.pulsePhase += node.pulseSpeed;
      });

      // ── DRAW CONNECTIONS ──
      // Dynamic line distance threshold depending on state
      const baseDistance = p < 0.3 ? 90 : p < 0.7 ? 130 : 110;

      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < baseDistance) {
            const proximityRatio = (baseDistance - dist) / baseDistance;
            let alpha = proximityRatio * 0.13;
            let strokeStyle = "";

            if (p < 0.3) {
              // Phase 1: Jittery, disconnected red-slate strands
              const jitter = Math.random() > 0.08 ? 1 : 0.15;
              alpha = proximityRatio * 0.05 * jitter;
              strokeStyle = `rgba(239, 68, 68, ${alpha})`; // Warning red
            } else if (p < 0.7) {
              // Phase 2: Steady mesh forming (indigo-blue protocol colors)
              alpha = proximityRatio * 0.09;
              strokeStyle = `rgba(99, 102, 241, ${alpha})`; // Indigo
            } else {
              // Phase 3: Perfect structural connections (purple/cyan)
              alpha = proximityRatio * 0.15;

              // Structure links (specifically connecting block squares)
              const isBlockLink = 
                (n1.id >= 12 && n1.id < 28) && 
                (n2.id >= 12 && n2.id < 28) && 
                Math.floor((n1.id - 12) / 4) === Math.floor((n2.id - 12) / 4);

              if (isBlockLink) {
                strokeStyle = `rgba(168, 85, 247, ${alpha * 1.5})`; // Vivid Purple for block edges
              } else if (n1.id < 12 && n2.id < 12) {
                strokeStyle = `rgba(6, 182, 212, ${alpha * 1.3})`; // Cyan for validator rings
              } else {
                strokeStyle = `rgba(59, 130, 246, ${alpha})`; // Blue for outer branches
              }
            }

            ctx.beginPath();
            ctx.moveTo(n1.x, n2.x); // Wait, error here in my draft: should be ctx.moveTo(n1.x, n1.y)!
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = p > 0.7 ? (nodes[i].id < 12 ? 1.2 : 0.8) : 0.8;
            ctx.stroke();
          }
        }
      }

      // ── DRAW TRANSACTION PULSES ──
      // Spawns little dynamic lightning nodes moving along connected lines
      if (p > 0.3) {
        for (let i = 0; i < 5; i++) {
          // Pre-assigned deterministic pathways
          const sourceIdx = (i * 7) % nodeCount;
          const destIdx = (sourceIdx + 11) % nodeCount;

          // Make sure destinations are relatively close to source
          const sNode = nodes[sourceIdx];
          const dNode = nodes[destIdx];
          const dist = Math.hypot(sNode.x - dNode.x, sNode.y - dNode.y);

          if (dist < baseDistance * 1.5) {
            // Speed scaled by phase stability
            const speed = p > 0.7 ? 0.005 : 0.003;
            const progress = (time * speed + i * 0.2) % 1;

            // Draw a cohesive 3-step comet tail pulse
            for (let t = 0; t < 3; t++) {
              const trailProgress = progress - t * 0.018;
              if (trailProgress < 0) continue;

              const px = sNode.x + trailProgress * (dNode.x - sNode.x);
              const py = sNode.y + trailProgress * (dNode.y - sNode.y);
              const size = (p > 0.7 ? 2 : 1.5) * (1 - t * 0.22);
              const opacity = (p > 0.7 ? 0.75 : 0.45) * (1 - t * 0.3);

              ctx.beginPath();
              ctx.arc(px, py, size, 0, Math.PI * 2);
              ctx.fillStyle = p > 0.7 ? `rgba(34, 211, 238, ${opacity})` : `rgba(129, 140, 248, ${opacity})`;
              ctx.fill();

              // Volumetric ambient glow for lead trail element
              if (t === 0 && p > 0.7) {
                ctx.shadowColor = "rgba(34, 211, 238, 0.8)";
                ctx.shadowBlur = 4;
                ctx.beginPath();
                ctx.arc(px, py, 3.5, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(34, 211, 238, 0.15)";
                ctx.fill();
                ctx.shadowBlur = 0; // reset
              }
            }
          }
        }
      }

      // ── DRAW ACTIVE NODES ──
      nodes.forEach((node) => {
        // Calculate dynamic breathing opacity
        const pulse = Math.sin(node.pulsePhase) * 0.35 + 0.65;
        let nodeColor = "";
        let finalSize = node.size;

        if (p < 0.3) {
          // Phase 1 (Confusion): isolated warning red/slate points
          const jitter = Math.random() > 0.15 ? 1 : 0.3;
          nodeColor = `rgba(239, 68, 68, ${pulse * 0.45 * jitter})`; // Dim warning red
          finalSize = node.size * 0.8;
        } else if (p < 0.7) {
          // Phase 2 (Forming): growing indigo nodes
          nodeColor = `rgba(99, 102, 241, ${pulse * 0.75})`;
        } else {
          // Phase 3 (Mastery): Highly stabilized cyan, purple, and green validators
          if (node.id < 12) {
            nodeColor = `rgba(34, 211, 238, ${pulse * 0.95})`; // Cyan validators
            finalSize = node.size * 1.3;

            // Extra outer glow for primary validators
            ctx.beginPath();
            ctx.arc(node.x, node.y, finalSize * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(34, 211, 238, ${pulse * 0.1})`;
            ctx.fill();
          } else if (node.id >= 12 && node.id < 28) {
            nodeColor = `rgba(168, 85, 247, ${pulse * 0.85})`; // Purple blocks
          } else {
            nodeColor = `rgba(59, 130, 246, ${pulse * 0.65})`; // Blue telemetries
          }
        }

        // Draw cursor proximity highlight on the node
        if (mxRef.active) {
          const dx = node.x - mxRef.x;
          const dy = node.y - mxRef.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 100) {
            const glowAmount = (100 - dist) / 100;
            // Draw a subtle halo behind node
            ctx.beginPath();
            ctx.arc(node.x, node.y, finalSize * (2 + glowAmount * 2), 0, Math.PI * 2);
            ctx.fillStyle = p > 0.7 ? `rgba(168, 85, 247, ${glowAmount * 0.2})` : `rgba(99, 102, 241, ${glowAmount * 0.15})`;
            ctx.fill();
          }
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, finalSize, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-45"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
