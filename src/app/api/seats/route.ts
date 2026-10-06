import { NextResponse } from "next/server";
import { getSeats } from "@/lib/server/seats";
import type { SeatsResponse } from "@/lib/seats";

export const dynamic = "force-dynamic";

export async function GET() {
  const slots = await getSeats();
  if (!slots) {
    return NextResponse.json({ available: false } satisfies SeatsResponse, { headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json({ available: true, slots } satisfies SeatsResponse, { headers: { "Cache-Control": "public, max-age=15, s-maxage=30" } });
}
