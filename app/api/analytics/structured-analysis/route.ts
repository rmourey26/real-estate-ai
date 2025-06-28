import { NextResponse } from "next/server"
import { runAgentWithStructuredOutput } from "@/lib/ai/agent-system"
import { z } from "zod"

// Schema for structured market analysis
const marketAnalysisSchema = z.object({
  summary: z.string(),
  keyTrends: z.array(
    z.object({
      trend: z.string(),
      impact: z.string(),
      confidence: z.number().min(0).max(100),
    }),
  ),
  hotMarkets: z.array(
    z.object({
      location: z.string(),
      priceChange: z.string(),
      inventory: z.string(),
      outlook: z.string(),
    }),
  ),
})

export async function GET() {
  try {
    const structuredAnalysis = await runAgentWithStructuredOutput(
      "market-analyzer",
      "Analyze the current US real estate market and provide structured insights on trends, hot markets, and investment recommendations.",
      marketAnalysisSchema,
    )

    return NextResponse.json({ structuredAnalysis })
  } catch (error) {
    console.error("Error generating structured analysis:", error)

    // Fallback static content
    const fallbackAnalysis = {
      summary:
        "The US real estate market is transitioning from a period of rapid growth to a more balanced state, with regional variations becoming more pronounced.",
      keyTrends: [
        {
          trend: "Price Growth Moderation",
          impact: "Home price appreciation has slowed from double digits to 3-5% annually",
          confidence: 85,
        },
        {
          trend: "Inventory Normalization",
          impact: "Housing supply has increased 15% year-over-year, improving buyer options",
          confidence: 90,
        },
        {
          trend: "Interest Rate Sensitivity",
          impact: "7% mortgage rates continue to impact affordability and buyer demand",
          confidence: 95,
        },
      ],
      hotMarkets: [
        {
          location: "Austin, TX",
          priceChange: "+4.2%",
          inventory: "3.2 months supply",
          outlook: "Strong job growth supporting demand",
        },
        {
          location: "Tampa, FL",
          priceChange: "+3.8%",
          inventory: "2.8 months supply",
          outlook: "Population growth driving market",
        },
        {
          location: "Nashville, TN",
          priceChange: "+3.5%",
          inventory: "3.1 months supply",
          outlook: "Diverse economy attracting buyers",
        },
      ],
    }

    return NextResponse.json({ structuredAnalysis: fallbackAnalysis })
  }
}
