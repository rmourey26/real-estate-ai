import { z } from "zod"

// Region type enum
export const RegionTypeEnum = z.enum(["city", "zip", "state", "neighborhood"])
export type RegionType = z.infer<typeof RegionTypeEnum>

// Market trend schema
export const MarketTrendSchema = z.object({
  region: z.string(),
  regionType: RegionTypeEnum,
  medianPrice: z.number().positive(),
  priceChangePct: z.number(),
  avgDaysOnMarket: z.number().nonnegative(),
  inventoryCount: z.number().nonnegative(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().positive(),
  source: z.enum(["redfin", "zillow", "mls", "internal", "repliers"]),
})

export type MarketTrend = z.infer<typeof MarketTrendSchema>

// Neighborhood info schema
export const NeighborhoodInfoSchema = z.object({
  overview: z.object({
    population: z.number().nonnegative(),
    medianIncome: z.number().nonnegative(),
    medianHomeValue: z.number().nonnegative(),
    costOfLivingIndex: z.number().nonnegative(),
  }),
  schools: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      grades: z.string(),
      rating: z.number().min(0).max(10),
      distance: z.number().nonnegative(),
    }),
  ),
  amenities: z.object({
    restaurants: z.number().nonnegative(),
    groceryStores: z.number().nonnegative(),
    parks: z.number().nonnegative(),
    gyms: z.number().nonnegative(),
    hospitals: z.number().nonnegative(),
  }),
  transportation: z.object({
    walkScore: z.number().min(0).max(100),
    transitScore: z.number().min(0).max(100),
    bikeScore: z.number().min(0).max(100),
    averageCommute: z.number().nonnegative(),
  }),
  crimeRate: z.object({
    overall: z.string(),
    violent: z.string(),
    property: z.string(),
    comparedToNational: z.string(),
  }),
  marketTrends: z.object({
    homeValueTrend: z.string(),
    forecastNextYear: z.string(),
    averageDaysOnMarket: z.number().nonnegative(),
    medianRent: z.number().nonnegative(),
  }),
})

export type NeighborhoodInfo = z.infer<typeof NeighborhoodInfoSchema>

// Market insight schema
export const MarketInsightSchema = z.object({
  region: z.string(),
  regionType: z.string(),
  period: z.string(),
  metrics: z.object({
    medianPrice: z.number().positive(),
    priceChangePct: z.number(),
    avgDaysOnMarket: z.number().nonnegative(),
    inventoryCount: z.number().nonnegative(),
    salesVolume: z.number().nonnegative(),
    medianRentPrice: z.number().positive().optional(),
    rentYield: z.number().positive().optional(),
    priceToRentRatio: z.number().positive().optional(),
    affordabilityIndex: z.number().min(0).max(100).optional(),
    marketHeatIndex: z.number().min(0).max(100).optional(),
  }),
  forecast: z.object({
    shortTerm: z.object({
      priceChangePct: z.number(),
      confidence: z.number().min(0).max(100),
    }),
    mediumTerm: z.object({
      priceChangePct: z.number(),
      confidence: z.number().min(0).max(100),
    }),
    longTerm: z.object({
      priceChangePct: z.number(),
      confidence: z.number().min(0).max(100),
    }),
  }),
})

export type MarketInsight = z.infer<typeof MarketInsightSchema>

// Opportunity zone schema
export const OpportunityZoneSchema = z.object({
  region: z.string(),
  regionType: z.string(),
  opportunityScore: z.number().min(0).max(100),
  metrics: z.object({
    medianPrice: z.number().positive(),
    priceChangePct: z.number(),
    avgDaysOnMarket: z.number().nonnegative(),
    inventoryCount: z.number().nonnegative(),
    rentalDemand: z.number().min(0).max(100),
    jobGrowth: z.number(),
    populationGrowth: z.number(),
    incomeGrowth: z.number(),
    newDevelopment: z.number().nonnegative(),
    investorActivity: z.number().min(0).max(100),
  }),
  insights: z.array(z.string()),
  recommendedPropertyTypes: z.array(z.string()),
  riskFactors: z.array(z.string()),
})

export type OpportunityZone = z.infer<typeof OpportunityZoneSchema>
