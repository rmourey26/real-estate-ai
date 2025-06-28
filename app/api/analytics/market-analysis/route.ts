import { runAgent } from "@/lib/ai/agent-system"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const marketAnalysis = await runAgent(
      "market-analyzer",
      "Provide a comprehensive analysis of the current US real estate market conditions, focusing on trends in the last 30 days. Format your response as clean HTML using Tailwind CSS classes for styling, including headings, paragraphs, and lists.",
    )
    return NextResponse.json({ marketAnalysis })
  } catch (err) {
    console.error("[MARKET_ANALYSIS_API_ERROR]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
