import { type NextRequest, NextResponse } from "next/server"

// Fallback strategy generator that doesn't depend on any AI modules
function generateFallbackStrategy(params: {
  region: string
  budget: number
  investmentGoals: string
  timeHorizon: string
  riskTolerance: string
}) {
  return `
    # Investment Strategy for ${params.region}
    
    ## Market Overview
    Based on our analysis, ${params.region} shows potential for real estate investment with varying opportunities depending on your goals.
    
    ## Recommended Strategy
    Given your budget of $${params.budget.toLocaleString()}, ${params.investmentGoals} goals, ${params.timeHorizon} horizon, and ${params.riskTolerance} risk tolerance:
    
    ### Property Types to Target
    - Single-family homes in growing neighborhoods
    - Small multi-family properties (2-4 units)
    - Condos in central locations with good rental demand
    
    ### Acquisition Strategy
    - Focus on properties priced 10-15% below market value
    - Target properties requiring minor cosmetic renovations
    - Consider off-market opportunities through networking
    
    ### Financing Approach
    - Conventional financing with 20-25% down payment
    - Consider portfolio loans for multiple properties
    - Maintain cash reserves of 6 months per property
    
    ### Exit Strategy
    - Hold for long-term appreciation and cash flow
    - Refinance after 3-5 years to extract equity
    - Consider 1031 exchanges for portfolio growth
    
    ### Risk Mitigation
    - Diversify across different neighborhoods
    - Maintain adequate insurance coverage
    - Build relationships with reliable contractors
    
    This strategy is based on current market conditions and should be reviewed periodically as the market evolves.
    
    Note: This is a fallback strategy generated without AI assistance. For more personalized advice, please ensure the AI service is properly configured.
  `
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { region, budget, investmentGoals, timeHorizon, riskTolerance } = body

    if (!region) {
      return NextResponse.json({ error: "Region parameter is required" }, { status: 400 })
    }

    const params = {
      region,
      budget: budget || 250000,
      investmentGoals: investmentGoals || "Balanced approach (cash flow and appreciation)",
      timeHorizon: timeHorizon || "Medium-term (3-5 years)",
      riskTolerance: riskTolerance || "Moderate",
    }

    // First try to use the AI-powered strategy generator
    try {
      // Use a dynamic import with a separate function to isolate any potential errors
      const aiStrategy = await generateAIStrategy(params)
      return NextResponse.json({ strategy: aiStrategy })
    } catch (error) {
      console.error("Error generating AI investment strategy:", error)

      // Fall back to the non-AI strategy generator
      const fallbackStrategy = generateFallbackStrategy(params)
      return NextResponse.json({
        strategy: fallbackStrategy,
        notice: "Using fallback strategy generator. AI service unavailable.",
      })
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

// Completely isolated function to handle AI strategy generation
// This function is only called at runtime, never during build
async function generateAIStrategy(params: {
  region: string
  budget: number
  investmentGoals: string
  timeHorizon: string
  riskTolerance: string
}) {
  // This dynamic import is wrapped in its own try/catch to isolate any errors
  try {
    // Dynamically import the agent system at runtime
    const { generateInvestmentStrategy } = await import("@/lib/ai/runtime-agent-system")

    // Call the function and return the result
    const result = await generateInvestmentStrategy(params)
    return result.investmentStrategy
  } catch (error) {
    console.error("Error in dynamic import of AI system:", error)
    throw new Error("AI system unavailable")
  }
}
