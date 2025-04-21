import { type NextRequest, NextResponse } from "next/server"
import { getMarketInsights } from "@/lib/api/real-estate"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const region = searchParams.get("region")
    const regionType = searchParams.get("regionType") || undefined

    if (!region) {
      return NextResponse.json({ error: "Region parameter is required" }, { status: 400 })
    }

    const insights = await getMarketInsights({
      region,
      regionType: regionType as any,
    })

    return NextResponse.json(insights)
  } catch (error) {
    console.error("Error in market insights API route:", error)
    return NextResponse.json({ error: "Failed to fetch market insights" }, { status: 500 })
  }
}
