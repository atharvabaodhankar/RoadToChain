/* eslint-disable */
import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title =
      searchParams.get("title") ??
      "RoadToChain — Learn Web3 & Blockchain Engineering";
    const track = searchParams.get("track") ?? "Web3 Engineering";
    const theme = searchParams.get("theme") ?? "light";
    const isLight = theme === "light";

    // Read logo as base64 data URI
    let logoBase64 = "";
    try {
      const logoPath = path.join(process.cwd(), "public", "logo.png");
      const logoBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    } catch (err) {
      console.error("Failed to load logo.png for OG image", err);
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "54px 64px",
            backgroundColor: isLight ? "#fafafb" : "#0a0a0d",
            backgroundImage: isLight
              ? "radial-gradient(circle at 92% 10%, rgba(147, 51, 234, 0.12) 0%, transparent 48%), radial-gradient(circle at 8% 90%, rgba(79, 70, 229, 0.08) 0%, transparent 45%)"
              : "radial-gradient(circle at 92% 10%, rgba(168, 85, 247, 0.18) 0%, transparent 50%), radial-gradient(circle at 8% 90%, rgba(99, 102, 241, 0.15) 0%, transparent 45%)",
            position: "relative",
          }}
        >
          {/* Top Border Glow Accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background:
                "linear-gradient(90deg, transparent 0%, #9333ea 50%, transparent 100%)",
            }}
          />

          {/* Top Bar: Brand Logo & Pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Logo + Platform Name */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {logoBase64 ? (
                <img
                  src={logoBase64}
                  alt="Logo"
                  width="48"
                  height="48"
                  style={{
                    objectFit: "contain",
                    borderRadius: "10px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                  }}
                />
              )}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "20px",
                    fontWeight: "800",
                    letterSpacing: "0.15em",
                    color: isLight ? "#111827" : "#ffffff",
                    textTransform: "uppercase",
                  }}
                >
                  ROADTOCHAIN
                </span>
                <span
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: "12px",
                    color: isLight ? "#6b7280" : "#9ca3af",
                    letterSpacing: "0.05em",
                  }}
                >
                  Learn Web3 & Blockchain Engineering
                </span>
              </div>
            </div>

            {/* Badges Right */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  backgroundColor: isLight ? "#f3e8ff" : "rgba(147, 51, 234, 0.15)",
                  border: isLight
                    ? "1px solid #e9d5ff"
                    : "1px solid rgba(168, 85, 247, 0.3)",
                }}
              >
                <div
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: "#9333ea",
                  }}
                />
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: isLight ? "#7e22ce" : "#c084fc",
                    letterSpacing: "0.05em",
                  }}
                >
                  8 STRUCTURED TRACKS
                </span>
              </div>

              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  backgroundColor: isLight ? "#ffffff" : "#18181b",
                  border: isLight ? "1px solid #e5e7eb" : "1px solid #27272a",
                  fontFamily: "monospace",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: isLight ? "#4b5563" : "#d1d5db",
                }}
              >
                100% FREE
              </div>
            </div>
          </div>

          {/* Main Hero Card Body */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              marginTop: "8px",
            }}
          >
            {/* Category / Track Pill */}
            <div style={{ display: "flex" }}>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "13px",
                  fontWeight: "800",
                  color: isLight ? "#7c3aed" : "#a855f7",
                  backgroundColor: isLight ? "#ede9fe" : "rgba(124, 58, 237, 0.18)",
                  padding: "5px 14px",
                  borderRadius: "6px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  border: isLight
                    ? "1px solid #ddd6fe"
                    : "1px solid rgba(139, 92, 246, 0.3)",
                }}
              >
                {track}
              </span>
            </div>

            {/* Giant Title */}
            <div
              style={{
                fontFamily: "sans-serif",
                fontSize: title.length > 55 ? "44px" : "52px",
                fontWeight: "800",
                color: isLight ? "#0f172a" : "#f8fafc",
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                maxWidth: "1060px",
              }}
            >
              {title}
            </div>

            {/* Description Subtitle */}
            <div
              style={{
                fontFamily: "sans-serif",
                fontSize: "20px",
                color: isLight ? "#475569" : "#94a3b8",
                lineHeight: 1.4,
                maxWidth: "960px",
              }}
            >
              From blockchain fundamentals to Solidity, ERC-4337, Circom ZK proofs & DeFi. Built from real shipped systems.
            </div>
          </div>

          {/* Topic Tags Ribbon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {[
              "Solidity & EVM",
              "ERC-4337 Smart Wallets",
              "ZK Proofs (Circom)",
              "DeFi & AMMs",
              "Subgraphs",
            ].map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: isLight ? "#334155" : "#cbd5e1",
                  backgroundColor: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.04)",
                  border: isLight ? "1px solid #e2e8f0" : "1px solid #27272a",
                  padding: "6px 14px",
                  borderRadius: "8px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Footer Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "20px",
              borderTop: isLight ? "1px solid #e2e8f0" : "1px solid #1e1e24",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: isLight ? "#0f172a" : "#f1f5f9",
                }}
              >
                roadtochain.tech
              </span>
              <span style={{ color: isLight ? "#94a3b8" : "#64748b" }}>•</span>
              <span
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "13px",
                  color: isLight ? "#64748b" : "#94a3b8",
                }}
              >
                Interactive Web3 Engineering Curriculum
              </span>
            </div>

            <div
              style={{
                fontFamily: "monospace",
                fontSize: "13px",
                color: isLight ? "#6b7280" : "#9ca3af",
                padding: "4px 12px",
                borderRadius: "6px",
                backgroundColor: isLight ? "#f1f5f9" : "#18181b",
              }}
            >
              No Hype · Real Systems
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error("OG Image generation error:", e);
    return new Response(`Failed to generate dynamic image: ${e.message}`, {
      status: 500,
    });
  }
}
