import { NextResponse } from "next/server"
import { config } from "@/lib/config"

export async function GET() {
  try {
    // Only attempt to use AI if we have an API key
    if (config.ai.openaiApiKey) {
      try {
        // Dynamically import AI modules only at runtime
        const { generateText } = await import("ai")
        const { openai } = await import("@ai-sdk/openai")

        // Run market prediction agent
        const { text } = await generateText({
          model: openai("gpt-4o"),
          prompt: "Predict the likely trends in the US real estate market over the next 3, 6, and 12 months.",
          system: `You are a real estate market forecasting AI. Your job is to predict future market trends based on current conditions.
          Provide separate predictions for short-term (3 months), medium-term (6 months), and long-term (12 months) horizons.
          Consider factors like interest rates, economic indicators, seasonal patterns, and regional variations.
          Include implications for investors with different strategies (cash flow, appreciation, etc.).
          Format your response in HTML with appropriate headings, paragraphs, and lists.`,
        })

        return NextResponse.json({ prediction: text })
      } catch (error) {
        console.error("Error generating market predictions with AI:", error)
        // Fall back to static content
        return NextResponse.json({
          prediction: `
            <h2>Real Estate Market Forecast</h2>
            
            <h3>Short-Term Outlook (3 months)</h3>
            <p>The market is expected to maintain current conditions with modest price growth in most regions. Seasonal patterns will likely influence activity levels with some slowdown during winter months.</p>
            
            <h3>Medium-Term Outlook (6 months)</h3>
            <p>Mortgage rates may see modest adjustments based on Federal Reserve policies. Housing inventory is expected to gradually improve, providing more options for buyers and potentially moderating price growth.</p>
            
            <h3>Long-Term Outlook (12 months)</h3>
            <p>The market is projected to continue its normalization process with more balanced conditions between buyers and sellers. Regional variations will persist, with stronger growth in areas with positive migration patterns and job creation.</p>
            
            <h3>Investment Implications</h3>
            <p>Investors should consider:</p>
            <ul>
              <li>Cash flow opportunities in stable markets</li>
              <li>Value-add strategies in emerging neighborhoods</li>
              <li>Long-term appreciation potential in high-growth metros</li>
              <li>Portfolio diversification across different property types and locations</li>
            </ul>
          `,
        })
      }
    } else {
      // No API key, return static content
      return NextResponse.json({
        prediction: `
          <h2>Real Estate Market Forecast</h2>
          
          <h3>Short-Term Outlook (3 months)</h3>
          <p>The market is expected to maintain current conditions with modest price growth in most regions. Seasonal patterns will likely influence activity levels with some slowdown during winter months.</p>
          
          <h3>Medium-Term Outlook (6 months)</h3>
          <p>Mortgage rates may see modest adjustments based on Federal Reserve policies. Housing inventory is expected to gradually improve, providing more options for buyers and potentially moderating price growth.</p>
          
          <h3>Long-Term Outlook (12 months)</h3>
          <p>The market is projected to continue its normalization process with more balanced conditions between buyers and sellers. Regional variations will persist, with stronger growth in areas with positive migration patterns and job creation.</p>
          
          <h3>Investment Implications</h3>
          <p>Investors should consider:</p>
          <ul>
            <li>Cash flow opportunities in stable markets</li>
            <li>Value-add strategies in emerging neighborhoods</li>
            <li>Long-term appreciation potential in high-growth metros</li>
            <li>Portfolio diversification across different property types and locations</li>
          </ul>
        `,
      })
    }
  } catch (error) {
    console.error("Error in market predictions API route:", error)
    return NextResponse.json(
      {
        error: "Failed to generate market predictions",
      },
      { status: 500 },
    )
  }
}
