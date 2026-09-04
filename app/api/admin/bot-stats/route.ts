import { NextResponse } from "next/server";
import { getAdminBotStats } from "@/lib/bot/telemetry";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getAdminBotStats();
    return NextResponse.json(stats);
  } catch (err: unknown) {
    console.error("[api/admin/bot-stats] Failed to fetch bot stats:", err);
    const message = err instanceof Error ? err.message : "Failed to load bot telemetry";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
