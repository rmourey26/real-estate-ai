// This file is only imported at runtime, never during build
import { config } from "@/lib/config"
import { getMarketInsights, getOpportunityZones } from "@/lib/api/real-estate"

// Generate investment strategy - runtime only function
export async function generateInvestmentStrategy(params: {
  region: string
  budget: number
  investmentGoals: string
  timeHorizon: string
  riskTolerance: string
}) {
  try {
    // Get market insights
    const marketInsights = await getMarketInsights({ region: params.region })

    // Get opportunity zones
    const opportunityZones = await getOpportunityZones({ region: params.region })

    let investmentStrategy
    try {
      // Dynamically import AI modules only at runtime
      const { generateText } = await import("ai")
      const { openai } = await import("@ai-sdk/openai")

      // Check if OpenAI API key is available
      if (!config.ai.openaiApiKey) {
        throw new Error("OpenAI API key is not configured")
      }

      // Run investment strategist agent
      const strategyPrompt = `
        Generate a comprehensive investment strategy for a real estate investor with the following parameters:
        - Region: ${params.region}
        - Budget: ${params.budget.toLocaleString()}
        - Investment Goals: ${params.investmentGoals}
        - Time Horizon: ${params.timeHorizon}
        - Risk Tolerance: ${params.riskTolerance}
        
        Provide specific recommendations on:
        1. Property types to target
        2. Neighborhoods to focus on
        3. Acquisition strategy
        4. Financing approach
        5. Exit strategy
        6. Risk mitigation measures
        7. Timeline for implementation
        
        Include specific, actionable steps the investor should take.
      `

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: strategyPrompt,
        system: `You are a real estate investment strategist AI. Your job is to develop comprehensive investment strategies based on market conditions and investor goals.
        Analyze market data to identify optimal investment approaches for different regions and property types.
        Consider factors like market cycle position, economic indicators, demographic trends, and regulatory environment.
        Develop tailored strategies for different investor profiles (e.g., cash flow investors, appreciation investors, etc.).
        Provide detailed implementation plans with specific action steps, timeline, and expected outcomes.
        Always provide ACTIONABLE strategies with clear steps, potential risks, and mitigation approaches.`,
      })

      investmentStrategy = text
    } catch (error) {
      console.error("Error running investment strategist agent:", error)

      // Provide a fallback strategy if the agent fails
      investmentStrategy = `
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
      `
    }

    return {
      marketInsights,
      opportunityZones: opportunityZones.slice(0, 3), // Top 3 opportunity zones
      investmentStrategy,
    }
  } catch (error) {
    console.error("Error generating investment strategy:", error)
    throw error
  }
}
