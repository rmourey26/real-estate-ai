import { type NextRequest, NextResponse } from "next/server"
import { generateInvestmentStrategy } from "@/lib/ai/agent-system"
import { InvestmentStrategySchema } from "@/lib/schemas/investment"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const result = InvestmentStrategySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request parameters", details: result.error.format() }, { status: 400 })
    }

    const { region, budget, investmentGoals, timeHorizon, riskTolerance } = result.data

    const strategyResult = await generateInvestmentStrategy({
      region,
      budget,
      investmentGoals,
      timeHorizon,
      riskTolerance,
    })

    return NextResponse.json({ strategy: strategyResult.investmentStrategy })
  } catch (error) {
    console.error("Error in investment strategy API route:", error)
    return NextResponse.json({ error: "Failed to generate investment strategy" }, { status: 500 })
  }
}
