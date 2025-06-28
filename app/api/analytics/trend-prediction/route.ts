import { runAgent } from "@/lib/ai/agent-system"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const trendPrediction = await runAgent(
      "trend-predictor",
      "Predict the likely trends in the US real estate market over the next 3, 6, and 12 months. Format your response as clean HTML using Tailwind CSS classes for styling, including headings, paragraphs, and lists.",
    )
    return NextResponse.json({ trendPrediction })
  } catch (error) {
    console.error("[TREND_PREDICTION_API_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
