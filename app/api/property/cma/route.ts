import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const propertyId = searchParams.get("propertyId")
    const radius = searchParams.get("radius")
    const maxComps = searchParams.get("maxComps")

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID parameter is required" }, { status: 400 })
    }

    // Dynamically import the runCMAAnalysis function
    const { runCMAAnalysis } = await import("@/lib/ai/agent-system")

    const cma = await runCMAAnalysis(propertyId)
    return NextResponse.json({ cma })
  } catch (error) {
    console.error("Error in CMA API route:", error)
    return NextResponse.json({ error: "Failed to generate CMA" }, { status: 500 })
  }
}
