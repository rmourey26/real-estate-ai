import { type NextRequest, NextResponse } from "next/server"
import { runCMAAnalysis } from "@/lib/ai/agent-system"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const propertyId = searchParams.get("propertyId")

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
    }

    const cmaData = await runCMAAnalysis(propertyId)

    return NextResponse.json(cmaData)
  } catch (error) {
    console.error("Error in CMA API route:", error)
    return NextResponse.json({ error: "Failed to perform comparative market analysis" }, { status: 500 })
  }
}
