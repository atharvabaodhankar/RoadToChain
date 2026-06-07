import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") ?? "ChainVidya";
    const track = searchParams.get("track") ?? "Web3 Engineering";

    return new ImageResponse(
      (
        <div
          style={{
            background: "#0f0f12",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "64px",
            justifyContent: "space-between",
          }}
        >
          {/* Top Brand Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#7c3aed",
              }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "16px",
                color: "#a1a1aa",
                fontWeight: "bold",
              }}
            >
              ChainVidya
            </span>
          </div>

          {/* Title and Category */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "14px",
                color: "#7c3aed",
                marginBottom: "16px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: "bold",
              }}
            >
              {track}
            </div>
            <div
              style={{
                fontSize: "52px",
                fontWeight: "800",
                color: "#ededed",
                lineHeight: 1.2,
                letterSpacing: "-0.03em",
                maxWidth: "950px",
              }}
            >
              {title}
            </div>
          </div>

          {/* Bottom URL and Badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "14px",
                color: "#71717a",
              }}
            >
              chainvidya.com
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "13px",
                color: "#a1a1aa",
                padding: "6px 14px",
                border: "1px solid #27272a",
                borderRadius: "6px",
                background: "#18181b",
              }}
            >
              Web3 · No hype
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate dynamic image`, { status: 500 });
  }
}
