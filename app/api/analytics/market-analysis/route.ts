import { NextResponse } from "next/server"
import { runAgent } from "@/lib/ai/agent-system"

export async function GET() {
  try {
    const marketAnalysis = await runAgent(
      "market-analyzer",
      "Provide a comprehensive analysis of the current US real estate market conditions, focusing on trends in the last 30 days.",
    )

    return NextResponse.json({ marketAnalysis })
  } catch (error) {
    console.error("Error generating market analysis:", error)

    // Fallback static content
    const fallbackAnalysis = `
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Current Market Conditions</h3>
        <p>The US real estate market is experiencing a period of stabilization after significant volatility in 2023. Key trends include:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>Price Moderation:</strong> Home price growth has slowed to 3-5% annually in most markets</li>
          <li><strong>Inventory Recovery:</strong> Housing inventory has increased by 15% compared to last year</li>
          <li><strong>Interest Rate Impact:</strong> Mortgage rates around 7% continue to affect buyer demand</li>
          <li><strong>Regional Variations:</strong> Sunbelt markets showing resilience while coastal markets cool</li>
        </ul>
      </div>
    `

    return NextResponse.json({ marketAnalysis: fallbackAnalysis })
  }
}
