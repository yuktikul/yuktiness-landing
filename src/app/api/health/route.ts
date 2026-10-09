import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Uptime check. Deliberately says nothing about configuration or versions. */
export function GET() {
  return NextResponse.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
}
