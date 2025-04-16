import { type NextRequest, NextResponse } from "next/server"
import { generateInvestmentStrategy } from "@/lib/ai/agent-system"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { region, budget, investmentGoals, timeHorizon, riskTolerance } = body

    if (!region) {
      return NextResponse.json({ error: "Region parameter is required" }, { status: 400 })
    }

    try {
      const result = await generateInvestmentStrategy({
        region,
        budget: budget || 250000,
        investmentGoals: investmentGoals || "Balanced approach (cash flow and appreciation)",
        timeHorizon: timeHorizon || "Medium-term (3-5 years)",
        riskTolerance: riskTolerance || "Moderate",
      })

      return NextResponse.json({ strategy: result.investmentStrategy })
    } catch (error) {
      console.error("Error generating investment strategy:", error)

      // Return a more helpful error message
      return NextResponse.json(
        {
          error: "Failed to generate investment strategy",
          message:
            "The AI service is currently unavailable. Please try again later or contact support if the issue persists.",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in investment strategy API route:", error)
    return NextResponse.json(
      {
        error: "Failed to process request",
        message: "There was an error processing your request. Please check your input and try again.",
      },
      { status: 500 },
    )
  }
}
