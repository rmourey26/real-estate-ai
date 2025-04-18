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

        // Run market analysis agent
        const { text } = await generateText({
          model: openai("gpt-4o"),
          prompt:
            "Provide a comprehensive analysis of the current US real estate market conditions, focusing on trends in the last 30 days.",
          system: `You are a real estate market analyst AI. Your job is to analyze current market conditions and provide insights.
          Focus on key metrics like median prices, inventory levels, days on market, and regional variations.
          Consider factors like interest rates, economic indicators, and seasonal patterns.
          Format your response in HTML with appropriate headings, paragraphs, and lists.`,
        })

        return NextResponse.json({ analysis: text })
      } catch (error) {
        console.error("Error generating market analysis with AI:", error)
        // Fall back to static content
        return NextResponse.json({
          analysis: `
            <h2>Current US Real Estate Market Overview</h2>
            <p>The US real estate market continues to show regional variations with some markets experiencing moderate growth while others face challenges with affordability and inventory constraints.</p>
            
            <h3>Key Observations:</h3>
            <ul>
              <li>Mortgage rates have stabilized but remain higher than historical averages</li>
              <li>Housing inventory has improved slightly but remains below pre-pandemic levels</li>
              <li>Price appreciation has moderated in most markets</li>
              <li>Regional markets show significant variation in performance</li>
              <li>Rental markets remain strong in most metropolitan areas</li>
            </ul>
            
            <p>Investors should focus on markets with strong economic fundamentals, population growth, and diversified employment sectors.</p>
          `,
        })
      }
    } else {
      // No API key, return static content
      return NextResponse.json({
        analysis: `
          <h2>Current US Real Estate Market Overview</h2>
          <p>The US real estate market continues to show regional variations with some markets experiencing moderate growth while others face challenges with affordability and inventory constraints.</p>
          
          <h3>Key Observations:</h3>
          <ul>
            <li>Mortgage rates have stabilized but remain higher than historical averages</li>
            <li>Housing inventory has improved slightly but remains below pre-pandemic levels</li>
            <li>Price appreciation has moderated in most markets</li>
            <li>Regional markets show significant variation in performance</li>
            <li>Rental markets remain strong in most metropolitan areas</li>
          </ul>
          
          <p>Investors should focus on markets with strong economic fundamentals, population growth, and diversified employment sectors.</p>
        `,
      })
    }
  } catch (error) {
    console.error("Error in market analysis API route:", error)
    return NextResponse.json(
      {
        error: "Failed to generate market analysis",
      },
      { status: 500 },
    )
  }
}
