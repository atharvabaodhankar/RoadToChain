import { NextRequest, NextResponse } from "next/server";
import { createAssistantStream } from "@/lib/bot/service";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request", message: "Messages array cannot be empty." },
        { status: 400 }
      );
    }

    // Determine client identifier for rate limiting:
    // 1. Authorization/User Header (if provided by client)
    // 2. IP address from headers
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const cfIp = req.headers.get("cf-connecting-ip");
    const authHeader = req.headers.get("x-user-id");

    const clientIdentifier =
      authHeader ||
      (forwardedFor ? forwardedFor.split(",")[0].trim() : null) ||
      realIp ||
      cfIp ||
      "anonymous_client";

    return await createAssistantStream(messages, clientIdentifier);
  } catch (err: unknown) {
    console.error("[api/chat] Error:", err);
    const message = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message,
      },
      { status: 500 }
    );
  }
}
