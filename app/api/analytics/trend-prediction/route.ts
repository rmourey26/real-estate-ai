import { NextResponse } from "next/server"
import { runAgent } from "@/lib/ai/agent-system"

export async function GET() {
  try {
    const trendPrediction = await runAgent(
      "trend-predictor",
      "Predict the likely trends in the US real estate market over the next 3, 6, and 12 months.",
    )

    return NextResponse.json({ trendPrediction })
  } catch (error) {
    console.error("Error generating trend prediction:", error)

    // Fallback static content
    const fallbackPrediction = `
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Market Predictions</h3>
        <div class="grid gap-4 md:grid-cols-3">
          <div class="border rounded-lg p-4">
            <h4 class="font-medium">3-Month Outlook</h4>
            <p class="text-sm text-muted-foreground mt-2">Continued price stabilization with seasonal inventory increases expected through spring.</p>
          </div>
          <div class="border rounded-lg p-4">
            <h4 class="font-medium">6-Month Outlook</h4>
            <p class="text-sm text-muted-foreground mt-2">Potential for modest price growth as market adjusts to current interest rate environment.</p>
          </div>
          <div class="border rounded-lg p-4">
            <h4 class="font-medium">12-Month Outlook</h4>
            <p class="text-sm text-muted-foreground mt-2">Market normalization with 2-4% annual appreciation in most regions.</p>
          </div>
        </div>
      </div>
    `

    return NextResponse.json({ trendPrediction: fallbackPrediction })
  }
}
