import { z } from "zod"
import { getMarketInsights, getPropertyAnalysis, getOpportunityZones } from "@/lib/api/real-estate"

// Market Insights Tool
export const marketInsightsTool = {
  name: "market-insights",
  description: "Get detailed market insights for a specific region",
  schema: z.object({
    region: z.string().describe("The region to analyze (city, state, or zip code)"),
    regionType: z
      .enum(["city", "zip", "state", "neighborhood"])
      .optional()
      .describe("The type of region being analyzed"),
  }),
  execute: async ({ region, regionType }) => {
    try {
      const insights = await getMarketInsights({ region, regionType })

      // Calculate additional metrics
      const affordabilityRating =
        insights.metrics.affordabilityIndex > 80
          ? "Highly Affordable"
          : insights.metrics.affordabilityIndex > 60
            ? "Affordable"
            : insights.metrics.affordabilityIndex > 40
              ? "Moderately Affordable"
              : "Less Affordable"

      const marketHeatRating =
        insights.metrics.marketHeatIndex > 80
          ? "Very Hot"
          : insights.metrics.marketHeatIndex > 60
            ? "Hot"
            : insights.metrics.marketHeatIndex > 40
              ? "Balanced"
              : "Cool"

      const investmentPotential =
        insights.forecast.mediumTerm.priceChangePct > 5
          ? "Excellent"
          : insights.forecast.mediumTerm.priceChangePct > 3
            ? "Good"
            : insights.forecast.mediumTerm.priceChangePct > 1
              ? "Moderate"
              : "Limited"

      return {
        region: insights.region,
        regionType: insights.regionType,
        currentMetrics: {
          medianPrice: `$${insights.metrics.medianPrice.toLocaleString()}`,
          priceChangePct: `${insights.metrics.priceChangePct}%`,
          avgDaysOnMarket: insights.metrics.avgDaysOnMarket,
          inventoryCount: insights.metrics.inventoryCount,
          medianRentPrice: insights.metrics.medianRentPrice
            ? `$${insights.metrics.medianRentPrice.toLocaleString()}`
            : "N/A",
          rentYield: insights.metrics.rentYield ? `${insights.metrics.rentYield}%` : "N/A",
        },
        marketConditions: {
          affordabilityRating,
          marketHeatRating,
          investmentPotential,
          priceToRentRatio: insights.metrics.priceToRentRatio?.toFixed(1) || "N/A",
        },
        forecast: {
          shortTerm: {
            priceChangePct: `${insights.forecast.shortTerm.priceChangePct}%`,
            confidence: `${insights.forecast.shortTerm.confidence}%`,
            timeframe: "3-6 months",
          },
          mediumTerm: {
            priceChangePct: `${insights.forecast.mediumTerm.priceChangePct}%`,
            confidence: `${insights.forecast.mediumTerm.confidence}%`,
            timeframe: "1-2 years",
          },
          longTerm: {
            priceChangePct: `${insights.forecast.longTerm.priceChangePct}%`,
            confidence: `${insights.forecast.longTerm.confidence}%`,
            timeframe: "3-5 years",
          },
        },
        actionableInsights: [
          insights.metrics.priceChangePct > 5
            ? "Market is appreciating rapidly - consider buying sooner rather than later"
            : insights.metrics.priceChangePct < 0
              ? "Market is experiencing a correction - potential buying opportunities may emerge"
              : "Market is stable - focus on property-specific value rather than market timing",
          insights.metrics.avgDaysOnMarket < 20
            ? "Properties are selling quickly - be prepared to act fast on good deals"
            : insights.metrics.avgDaysOnMarket > 60
              ? "Properties are sitting on market longer - opportunity for price negotiations"
              : "Average market pace - standard due diligence timeframes should be sufficient",
          insights.metrics.rentYield && insights.metrics.rentYield > 6
            ? "Strong rental yields indicate good cash flow potential for investors"
            : insights.metrics.rentYield && insights.metrics.rentYield < 4
              ? "Low rental yields may require focus on appreciation rather than cash flow"
              : "Moderate rental yields - balance cash flow and appreciation in investment strategy",
          insights.forecast.mediumTerm.priceChangePct > 10
            ? "Strong appreciation forecast - consider buy-and-hold strategy"
            : insights.forecast.mediumTerm.priceChangePct < 2
              ? "Limited appreciation forecast - focus on immediate cash flow or value-add opportunities"
              : "Moderate appreciation forecast - balanced investment approach recommended",
        ],
      }
    } catch (error) {
      console.error("Error executing market insights tool:", error)
      throw error
    }
  },
}

// Property Investment Analysis Tool
export const propertyInvestmentAnalysisTool = {
  name: "property-investment-analysis",
  description: "Get detailed investment analysis for a specific property",
  schema: z.object({
    propertyId: z.string().describe("The ID of the property to analyze"),
  }),
  execute: async ({ propertyId }) => {
    try {
      const analysis = await getPropertyAnalysis(propertyId)

      // Generate actionable recommendations based on scores
      const actionableRecommendations = []

      if (analysis.valuationScore > 85) {
        actionableRecommendations.push(
          "Property appears to be undervalued - consider making an offer at or near asking price",
        )
      } else if (analysis.valuationScore < 70) {
        actionableRecommendations.push(
          "Property may be overvalued - consider negotiating price or looking for alternative properties",
        )
      }

      if (analysis.rentalScore > 85) {
        actionableRecommendations.push("Excellent rental potential - property would make a strong rental investment")
      }

      if (analysis.cashFlowScore > 85) {
        actionableRecommendations.push(
          "Strong cash flow potential - property should generate positive cash flow from day one",
        )
      } else if (analysis.cashFlowScore < 70) {
        actionableRecommendations.push(
          "Limited cash flow potential - may require additional capital or rent increases to achieve positive cash flow",
        )
      }

      if (analysis.appreciationScore > 85) {
        actionableRecommendations.push(
          "High appreciation potential - property located in area with strong growth indicators",
        )
      }

      if (analysis.riskScore > 80) {
        actionableRecommendations.push(
          "Higher risk profile - consider additional due diligence or risk mitigation strategies",
        )
      } else if (analysis.riskScore < 50) {
        actionableRecommendations.push("Low risk profile - property represents a relatively safe investment")
      }

      // Return structured analysis
      return {
        propertyId: analysis.propertyId,
        overallScore: analysis.overallScore,
        scoreBreakdown: {
          valuation: analysis.valuationScore,
          investment: analysis.investmentScore,
          rental: analysis.rentalScore,
          appreciation: analysis.appreciationScore,
          cashFlow: analysis.cashFlowScore,
          risk: analysis.riskScore,
        },
        financialMetrics: {
          estimatedValue: `$${analysis.financialMetrics.estimatedValue.toLocaleString()}`,
          estimatedRent: `$${analysis.financialMetrics.estimatedRent.toLocaleString()}/month`,
          capRate: `${analysis.financialMetrics.capRate}%`,
          cashOnCashReturn: `${analysis.financialMetrics.cashOnCashReturn}%`,
          netOperatingIncome: `$${analysis.financialMetrics.netOperatingIncome.toLocaleString()}/year`,
          breakEvenRatio: analysis.financialMetrics.breakEvenRatio,
        },
        insights: analysis.insights,
        recommendations: analysis.recommendations,
        actionableRecommendations,
        comparableProperties: analysis.comparableProperties.map((comp) => ({
          address: comp.address,
          price: `$${comp.price.toLocaleString()}`,
          pricePerSqFt: `$${comp.pricePerSqFt}/sqft`,
          bedBath: `${comp.bedrooms}bd/${comp.bathrooms}ba`,
          squareFeet: `${comp.squareFeet.toLocaleString()} sqft`,
          yearBuilt: comp.yearBuilt,
          distance: `${comp.distance} miles`,
          similarity: `${comp.similarity}%`,
        })),
      }
    } catch (error) {
      console.error("Error executing property investment analysis tool:", error)
      throw error
    }
  },
}

// Opportunity Zone Analysis Tool
export const opportunityZoneAnalysisTool = {
  name: "opportunity-zone-analysis",
  description: "Identify and analyze real estate investment opportunity zones in a region",
  schema: z.object({
    region: z.string().describe("The region to analyze (city, state, or zip code)"),
    regionType: z
      .enum(["city", "zip", "state", "neighborhood"])
      .optional()
      .describe("The type of region being analyzed"),
  }),
  execute: async ({ region, regionType }) => {
    try {
      const zones = await getOpportunityZones({ region, regionType })

      // Sort zones by opportunity score
      const sortedZones = [...zones].sort((a, b) => b.opportunityScore - a.opportunityScore)

      // Generate actionable insights
      const actionableInsights = []

      if (sortedZones.length > 0) {
        const topZone = sortedZones[0]
        actionableInsights.push(
          `${topZone.region} has the highest opportunity score (${topZone.opportunityScore}) - prioritize this area for investment`,
        )

        if (topZone.metrics.rentalDemand > 85) {
          actionableInsights.push(
            `${topZone.region} has exceptionally high rental demand - rental properties should perform well`,
          )
        }

        if (topZone.metrics.priceChangePct > 5) {
          actionableInsights.push(
            `${topZone.region} is experiencing rapid price appreciation (${topZone.metrics.priceChangePct}%) - consider buying sooner rather than later`,
          )
        }

        if (topZone.metrics.newDevelopment > 10) {
          actionableInsights.push(
            `${topZone.region} has significant new development activity - indicates strong growth potential`,
          )
        }

        if (topZone.metrics.jobGrowth > 3) {
          actionableInsights.push(
            `${topZone.region} has strong job growth (${topZone.metrics.jobGrowth}%) - positive indicator for long-term demand`,
          )
        }
      }

      // Return structured analysis
      return {
        region,
        regionType: regionType || "city",
        opportunityZones: sortedZones.map((zone) => ({
          name: zone.region,
          opportunityScore: zone.opportunityScore,
          keyMetrics: {
            medianPrice: `$${zone.metrics.medianPrice.toLocaleString()}`,
            priceChangePct: `${zone.metrics.priceChangePct}%`,
            avgDaysOnMarket: zone.metrics.avgDaysOnMarket,
            rentalDemand: `${zone.metrics.rentalDemand}/100`,
            jobGrowth: `${zone.metrics.jobGrowth}%`,
            populationGrowth: `${zone.metrics.populationGrowth}%`,
          },
          recommendedPropertyTypes: zone.recommendedPropertyTypes,
          insights: zone.insights,
          riskFactors: zone.riskFactors,
        })),
        actionableInsights,
        investmentStrategy: {
          shortTerm: "Focus on properties with immediate cash flow potential in top opportunity zones",
          mediumTerm:
            "Balance between cash flow and appreciation potential, with emphasis on areas showing strong job and population growth",
          longTerm:
            "Prioritize areas with significant development activity and infrastructure improvements for maximum appreciation",
        },
      }
    } catch (error) {
      console.error("Error executing opportunity zone analysis tool:", error)
      throw error
    }
  },
}
