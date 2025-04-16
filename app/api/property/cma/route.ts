import { type NextRequest, NextResponse } from "next/server"
import { CMAAnalysisSchema } from "@/lib/schemas/investment"
import { runCMAAnalysis } from "@/lib/ai/agent-system"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const propertyId = searchParams.get("propertyId")
    const radius = searchParams.get("radius") ? Number.parseFloat(searchParams.get("radius")!) : 1
    const maxComps = searchParams.get("maxComps") ? Number.parseInt(searchParams.get("maxComps")!, 10) : 5

    // Validate the request parameters
    const result = CMAAnalysisSchema.safeParse({ propertyId, radius, maxComps })

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request parameters", details: result.error.format() }, { status: 400 })
    }

    const cmaResult = await runCMAAnalysis(propertyId!)

    return NextResponse.json(cmaResult)
  } catch (error) {
    console.error("Error in CMA API route:", error)
    return NextResponse.json({ error: "Failed to generate CMA analysis" }, { status: 500 })
  }
}
