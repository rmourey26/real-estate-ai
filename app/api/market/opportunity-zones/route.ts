import { type NextRequest, NextResponse } from "next/server"
import { getOpportunityZones } from "@/lib/api/real-estate"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const region = searchParams.get("region")
    const regionType = searchParams.get("regionType") || undefined

    if (!region) {
      return NextResponse.json({ error: "Region parameter is required" }, { status: 400 })
    }

    const zones = await getOpportunityZones({
      region,
      regionType: regionType as any,
    })

    return NextResponse.json(zones)
  } catch (error) {
    console.error("Error in opportunity zones API route:", error)
    return NextResponse.json({ error: "Failed to fetch opportunity zones" }, { status: 500 })
  }
}
