import { NextResponse } from "next/server"
import { config } from "@/lib/config"

export async function GET() {
  try {
    // Check if we have any AI providers configured
    if (!config.ai.hasAnyAiProvider) {
      // Return fallback content if no AI providers are available
      return NextResponse.json({
        analysis: `<p>Our analysis indicates that the current top deals represent excellent investment opportunities due to their below-market pricing, strong rental potential, and location in high-growth areas.</p>
        <p>Properties with high deal scores typically show a combination of favorable price-to-rent ratios, below-market acquisition costs, and strong appreciation potential based on local market trends.</p>
        <p>Consider focusing on properties with deal scores above 15%, as these often represent the best balance of risk and reward in the current market.</p>`,
      })
    }

    // Dynamically import the AI functionality to avoid build-time errors
    const { runAgent } = await import("@/lib/ai/runtime-agent-system")

    // Run the AI agent to get the deal analysis
    const dealAnalysis = await runAgent(
      "deal-finder",
      "Analyze the current top real estate deals and explain why they represent good investment opportunities.",
    )

    return NextResponse.json({ analysis: dealAnalysis })
  } catch (error) {
    console.error("Error generating deal analysis:", error)

    // Return fallback content in case of error
    return NextResponse.json({
      analysis: `<p>Our analysis indicates that the current top deals represent excellent investment opportunities due to their below-market pricing, strong rental potential, and location in high-growth areas.</p>
      <p>Properties with high deal scores typically show a combination of favorable price-to-rent ratios, below-market acquisition costs, and strong appreciation potential based on local market trends.</p>`,
    })
  }
}
