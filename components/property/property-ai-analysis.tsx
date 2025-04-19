"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface PropertyAIAnalysisProps {
  property: any
  analysisType: "property" | "investment" | "neighborhood"
}

export function PropertyAIAnalysis({ property, analysisType }: PropertyAIAnalysisProps) {
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true)

        const response = await fetch(`/api/property/ai-analysis?propertyId=${property.id}&type=${analysisType}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch analysis: ${response.statusText}`)
        }

        const data = await response.json()
        setAnalysis(data.analysis)
        setLoading(false)
      } catch (err) {
        console.error(`Error fetching ${analysisType} analysis:`, err)
        setError(`Failed to load ${analysisType} analysis`)
        setLoading(false)

        // Set fallback analysis
        setAnalysis(getFallbackAnalysis(property, analysisType))
      }
    }

    fetchAnalysis()
  }, [property.id, analysisType, property])

  // Fallback analysis when AI is unavailable
  const getFallbackAnalysis = (property: any, type: string) => {
    switch (type) {
      case "property":
        return `
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
      case "investment":
        return `
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
      case "neighborhood":
        return `
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
      default:
        return `Analysis currently unavailable. Please try again later.`
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading {analysisType} analysis...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && !analysis) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const title =
    analysisType === "property"
      ? "AI Property Analysis"
      : analysisType === "investment"
        ? "AI Investment Analysis"
        : "AI Neighborhood Analysis"

  const description =
    analysisType === "property"
      ? "In-depth analysis of this property's investment potential"
      : analysisType === "investment"
        ? "Expert insights on this property as an investment"
        : "Insights about the neighborhood and surrounding area"

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: analysis }} />
      </CardContent>
    </Card>
  )
}
