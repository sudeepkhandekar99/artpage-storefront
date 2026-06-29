import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "ranin-storefront",
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || "local",
  });
}