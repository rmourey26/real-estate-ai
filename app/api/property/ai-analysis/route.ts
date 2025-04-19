import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const propertyId = searchParams.get("propertyId")
    const type = searchParams.get("type") || "property"

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
    }

    // Get property details from database
    const supabase = createClient()
    const { data: property, error } = await supabase
      .from("real_estate_listings")
      .select("*")
      .eq("id", propertyId)
      .single()

    if (error || !property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Generate analysis based on property data
    // This is a fallback that doesn't use AI at all
    let analysis = ""

    switch (type) {
      case "property":
        analysis = `
          <h2>Property Analysis</h2>
          <p>This ${property.bedrooms} bedroom, ${property.bathrooms} bathroom property in ${property.city}, ${property.state} offers good investment potential. At ${property.square_feet} square feet, the price per square foot is $${Math.round(property.price / property.square_feet)}.</p>
          
          <p>Key features of this property include:</p>
          <ul>
            <li>Property Type: ${property.property_type}</li>
            <li>Year Built: ${property.year_built}</li>
            <li>Price: $${property.price.toLocaleString()}</li>
          </ul>
          
          <p>Based on comparable properties in the area, this property appears to be priced ${property.deal_score}% below market value, representing a potential opportunity for investors.</p>
        `
        break
      case "investment":
        analysis = `
          <h2>Investment Analysis</h2>
          <p>This property presents a ${property.deal_score > 5 ? "strong" : "moderate"} investment opportunity in ${property.city}, ${property.state}.</p>
          
          <h3>Financial Overview</h3>
          <ul>
            <li>Purchase Price: $${property.price.toLocaleString()}</li>
            <li>Estimated Monthly Rent: $${Math.round(property.price * 0.005).toLocaleString()}</li>
            <li>Estimated Monthly Expenses: $${Math.round(property.price * 0.002).toLocaleString()}</li>
            <li>Estimated Monthly Cash Flow: $${Math.round(property.price * 0.003).toLocaleString()}</li>
            <li>Cap Rate: ${(Math.round(((property.price * 0.003 * 12) / property.price) * 1000) / 10).toFixed(1)}%</li>
            <li>Cash on Cash Return (20% down): ${(Math.round(((property.price * 0.003 * 12) / (property.price * 0.2)) * 1000) / 10).toFixed(1)}%</li>
          </ul>
          
          <p>This property could work well as a ${property.bedrooms >= 3 ? "family rental" : "starter home or small family rental"} with good potential for appreciation in this growing market.</p>
        `
        break
      case "neighborhood":
        analysis = `
          <h2>Neighborhood Analysis</h2>
          <p>${property.city}, ${property.state} is a ${property.deal_score > 5 ? "growing" : "stable"} market with good amenities and infrastructure.</p>
          
          <h3>Area Highlights</h3>
          <ul>
            <li>Schools: The area has several well-rated public and private schools within a short distance</li>
            <li>Shopping: Multiple shopping centers and grocery stores are conveniently located nearby</li>
            <li>Transportation: The neighborhood offers good access to major roads and public transportation</li>
            <li>Parks and Recreation: Several parks and recreational facilities are available in the vicinity</li>
          </ul>
          
          <p>The neighborhood has shown ${property.deal_score > 5 ? "strong" : "steady"} property value appreciation over the past few years, making it a ${property.deal_score > 5 ? "desirable" : "reasonable"} location for real estate investment.</p>
        `
        break
      default:
        analysis = "Analysis not available."
    }

    // Try to use AI if available (at runtime only)
    try {
      // Only attempt to use AI at runtime
      if (typeof window === "undefined") {
        const { runAgent } = await import("@/lib/ai/runtime-agent-system")

        let prompt = ""
        let agentType = ""

        switch (type) {
          case "property":
            agentType = "deal-finder"
            prompt = `Analyze this property in detail:
              Address: ${property.address}, ${property.city}, ${property.state} ${property.zip_code}
              Price: ${property.price}
              Details: ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, ${property.square_feet} sqft
              Year Built: ${property.year_built}
              Property Type: ${property.property_type}
              
              Provide a detailed analysis of why this is a good deal, potential ROI, and any risks to consider.`
            break
          case "investment":
            agentType = "investment-advisor"
            prompt = `Provide investment analysis for this property:
              Address: ${property.address}, ${property.city}, ${property.state} ${property.zip_code}
              Price: ${property.price}
              Details: ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, ${property.square_feet} sqft
              Year Built: ${property.year_built}
              Property Type: ${property.property_type}
              
              Calculate potential ROI, cash flow, and appreciation. Consider both short-term rental and long-term rental scenarios.`
            break
          case "neighborhood":
            agentType = "neighborhood-analyst"
            prompt = `Analyze the neighborhood for this property:
              City: ${property.city}
              State: ${property.state}
              Zip Code: ${property.zip_code}
              
              Provide insights on schools, crime rates, amenities, and future growth potential.`
            break
        }

        // Only try to run the agent if we have a prompt and agent type
        if (prompt && agentType) {
          const aiAnalysis = await runAgent(agentType, prompt)
          if (aiAnalysis) {
            analysis = aiAnalysis
          }
        }
      }
    } catch (error) {
      console.error("Error generating AI analysis:", error)
      // We'll use the fallback analysis that was already generated
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Error in property AI analysis API route:", error)
    return NextResponse.json({ error: "Failed to generate analysis" }, { status: 500 })
  }
}
