import { runAgentWithStructuredOutput } from "@/lib/ai/agent-system"
import { NextResponse } from "next/server"
import { z } from "zod"

export const dynamic = "force-dynamic"

// Define the Zod schema for the structured output.
// This schema is now co-located with its API route for better maintainability.
const marketAnalysisSchema = z.object({
  summary: z.string().describe("A brief summary of the overall market condition."),
  keyTrends: z.array(
    z.object({
      trend: z.string().describe("A concise description of the trend."),
      impact: z.string().describe("The impact of this trend on the market."),
      confidence: z.number().min(0).max(100).describe("Confidence level in this trend analysis (0-100)."),
    }),
  ),
  hotMarkets: z.array(
    z.object({
      location: z.string().describe("City and State, e.g., Austin, TX."),
      priceChange: z.string().describe("Year-over-year price change, e.g., '+5.2%'."),
      inventory: z.string().describe("Current inventory level, e.g., '2.8 months supply'."),
      outlook: z.string().describe("A brief outlook for this market."),
    }),
  ),
})

export async function GET() {
  try {
    const structuredAnalysis = await runAgentWithStructuredOutput(
      "market-analyzer",
      "Analyze the current US real estate market and provide structured insights on trends and hot markets.",
      marketAnalysisSchema,
    )
    return NextResponse.json({ structuredAnalysis })
  } catch (error) {
    console.error("[STRUCTURED_ANALYSIS_API_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
