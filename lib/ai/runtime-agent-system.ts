// This file is only imported at runtime, never during build
import { createClient } from "@/utils/supabase/server"
import { config } from "@/lib/config"

// Run an agent with a specific prompt - runtime only function
export async function runAgent(agentKey: string, prompt: string) {
  try {
    // Dynamically import AI modules only at runtime
    const { generateText } = await import("ai")

    // Select the appropriate model based on the agent key
    let model
    let systemPrompt = ""

    switch (agentKey) {
      case "deal-finder":
        if (!config.ai.anthropicApiKey) {
          throw new Error("Anthropic API key is not configured")
        }
        const { anthropic } = await import("@ai-sdk/anthropic")
        model = anthropic("claude-3-opus-20240229")
        systemPrompt = `You are a real estate deal finder AI. Your job is to identify exceptional real estate deals.
          Analyze property listings to find properties that are significantly undervalued compared to market rates.
          Consider factors like price per square foot, comparable properties, neighborhood trends, and property condition.
          For each potential deal, calculate a "deal score" representing the percentage below market value.
          Provide a brief explanation of why each property represents a good deal.
          Always provide ACTIONABLE recommendations that investors can use immediately.`
        break
      case "investment-advisor":
        if (!config.ai.openaiApiKey) {
          throw new Error("OpenAI API key is not configured")
        }
        const { openai } = await import("@ai-sdk/openai")
        model = openai("gpt-4o")
        systemPrompt = `You are a real estate investment advisor AI. Your job is to analyze properties and provide investment recommendations.
          Calculate key investment metrics like ROI, cap rate, cash flow, and appreciation potential.
          Consider factors like location, property condition, market trends, and financing options.
          Provide clear, actionable advice on whether a property is a good investment and why.
          Format your analysis in a structured way with clear sections for different aspects of the investment.
          Always provide ACTIONABLE recommendations with specific steps investors should take.`
        break
      case "neighborhood-analyst":
        if (!config.ai.anthropicApiKey) {
          throw new Error("Anthropic API key is not configured")
        }
        const { anthropic: anthropicNeighborhood } = await import("@ai-sdk/anthropic")
        model = anthropicNeighborhood("claude-3-opus-20240229")
        systemPrompt = `You are a neighborhood analysis AI. Your job is to provide detailed insights about neighborhoods.
          Analyze factors like schools, crime rates, amenities, transportation, and future development plans.
          Consider how these factors affect property values and quality of life.
          Provide a comprehensive overview of the neighborhood's strengths and weaknesses.
          Format your analysis in a structured way with clear sections for different aspects of the neighborhood.
          Always provide ACTIONABLE insights that can help investors or homebuyers make decisions.`
        break
      default:
        throw new Error(`Agent ${agentKey} not found`)
    }

    if (!model) {
      throw new Error("Failed to initialize AI model")
    }

    const { text } = await generateText({
      model,
      system: systemPrompt,
      prompt,
    })

    // Log the agent run
    const supabase = createClient()
    await supabase.from("ai_agent_logs").insert({
      agent_name: agentKey,
      action_type: "generate",
      details: { prompt, response: text.substring(0, 500) + "..." },
      success: true,
    })

    return text
  } catch (error) {
    console.error(`Error running agent ${agentKey}:`, error)

    // Log the error
    try {
      const supabase = createClient()
      await supabase.from("ai_agent_logs").insert({
        agent_name: agentKey,
        action_type: "generate",
        details: { prompt, error: String(error) },
        success: false,
        error_message: String(error),
      })
    } catch (logError) {
      console.error("Error logging agent failure:", logError)
    }

    // Return null to indicate failure - the caller should handle this
    return null
  }
}
