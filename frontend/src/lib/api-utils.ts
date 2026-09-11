import { NextResponse } from "next/server";

export function apiError(err: any, context?: string): NextResponse {
  console.error(`[API Error${context ? ` — ${context}` : ""}]:`, err);
  return NextResponse.json(
    { error: err?.message || "Internal server error" },
    { status: err?.status || 500 }
  );
}
