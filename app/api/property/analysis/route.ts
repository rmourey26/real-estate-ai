import { type NextRequest, NextResponse } from "next/server"
import { getPropertyAnalysis } from "@/lib/api/real-estate"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const propertyId = searchParams.get("propertyId")

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID parameter is required" }, { status: 400 })
    }

    const analysis = await getPropertyAnalysis(propertyId)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error in property analysis API route:", error)
    return NextResponse.json({ error: "Failed to fetch property analysis" }, { status: 500 })
  }
}
