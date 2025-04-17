import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const region = searchParams.get("region")
    const regionType = searchParams.get("regionType")

    if (!region) {
      return NextResponse.json({ error: "Region parameter is required" }, { status: 400 })
    }

    // Dynamically import the getOpportunityZones function
    const { getOpportunityZones } = await import("@/lib/api/real-estate")

    const zones = await getOpportunityZones({ region, regionType: regionType || undefined })
    return NextResponse.json({ zones })
  } catch (error) {
    console.error("Error in opportunity zones API route:", error)
    return NextResponse.json({ error: "Failed to fetch opportunity zones" }, { status: 500 })
  }
}
