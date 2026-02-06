import { NextResponse } from "next/server"

// =============================================================================
// DEPRECATED: Authentication is now handled by Supabase Auth (client-side)
// This endpoint is permanently disabled - returns 410 Gone
// =============================================================================

export async function POST() {
  return NextResponse.json(
    {
      error: "Auth moved to Supabase. This endpoint is permanently disabled.",
      code: "AUTH_DEPRECATED"
    },
    { status: 410 }
  )
}
