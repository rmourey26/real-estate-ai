import { NextResponse } from "next/server"

export async function GET() {
  // Only return the public URL, not the anon key
  return NextResponse.json({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  })
}
