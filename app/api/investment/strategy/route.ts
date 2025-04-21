import { type NextRequest, NextResponse } from "next/server"
import { generateInvestmentStrategy } from "@/lib/ai/agent-system"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { region, budget, investmentGoals, timeHorizon, riskTolerance } = body

    if (!region) {
      return NextResponse.json({ error: "Region parameter is required" }, { status: 400 })
    }

    const result = await generateInvestmentStrategy({
      region,
      budget: budget || 250000,
      investmentGoals: investmentGoals || "Balanced approach (cash flow and appreciation)",
      timeHorizon: timeHorizon || "Medium-term (3-5 years)",
      riskTolerance: riskTolerance || "Moderate",
    })

    return NextResponse.json({ strategy: result.investmentStrategy })
  } catch (error) {
    console.error("Error in investment strategy API route:", error)
    return NextResponse.json({ error: "Failed to generate investment strategy" }, { status: 500 })
  }
}
