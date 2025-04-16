import { z } from "zod"

// Property listing status enum
export const PropertyListingStatusEnum = z.enum(["active", "pending", "sold"])
export type PropertyListingStatus = z.infer<typeof PropertyListingStatusEnum>

// Property type enum
export const PropertyTypeEnum = z.enum([
  "single_family",
  "multi_family",
  "condo",
  "townhouse",
  "land",
  "commercial",
  "other",
])
export type PropertyType = z.infer<typeof PropertyTypeEnum>

// Base property schema
export const PropertySchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1).max(2),
  zip_code: z.string().min(5),
  price: z.number().positive(),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().nonnegative(),
  square_feet: z.number().positive(),
  year_built: z.number().int().positive(),
  property_type: z.string().min(1),
  listing_status: PropertyListingStatusEnum,
  deal_score: z.number().min(0).max(100),
  deal_reasons: z.array(z.string()).nullable(),
  listing_url: z.string().url().nullable(),
  image_url: z.string().url().nullable(),
})

export type Property = z.infer<typeof PropertySchema>

// Property details schema (extended from PropertySchema)
export const PropertyDetailsSchema = PropertySchema.extend({
  description: z.string(),
  features: z.array(z.string()),
  images: z.array(z.string().url()),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  daysOnMarket: z.number().int().nonnegative(),
  listingDate: z.string().datetime(),
  source: z.enum(["redfin", "zillow", "mls", "internal", "repliers"]),
})

export type PropertyDetails = z.infer<typeof PropertyDetailsSchema>

// Property valuation schema
export const PropertyValuationSchema = z.object({
  propertyId: z.string().uuid(),
  estimatedValue: z.number().positive(),
  valuationRange: z.object({
    low: z.number().positive(),
    high: z.number().positive(),
  }),
  lastUpdated: z.string().datetime(),
  historicalValues: z.array(
    z.object({
      date: z.string().datetime(),
      value: z.number().positive(),
    }),
  ),
  source: z.enum(["zillow", "internal", "repliers"]),
})

export type PropertyValuation = z.infer<typeof PropertyValuationSchema>

// Property search parameters schema
export const PropertySearchParamsSchema = z.object({
  location: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  bedrooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional(),
  propertyType: z.string().optional(),
  limit: z.number().int().positive().optional(),
})

export type PropertySearchParams = z.infer<typeof PropertySearchParamsSchema>

// Property investment analysis schema
export const PropertyInvestmentAnalysisSchema = z.object({
  propertyId: z.string().uuid(),
  valuationScore: z.number().min(0).max(100),
  investmentScore: z.number().min(0).max(100),
  rentalScore: z.number().min(0).max(100),
  appreciationScore: z.number().min(0).max(100),
  cashFlowScore: z.number().min(0).max(100),
  riskScore: z.number().min(0).max(100),
  overallScore: z.number().min(0).max(100),
  insights: z.array(z.string()),
  recommendations: z.array(z.string()),
  comparableProperties: z.array(
    z.object({
      id: z.string(),
      address: z.string(),
      price: z.number().positive(),
      pricePerSqFt: z.number().positive(),
      bedrooms: z.number().int().nonnegative(),
      bathrooms: z.number().int().nonnegative(),
      squareFeet: z.number().positive(),
      yearBuilt: z.number().int().positive(),
      distance: z.number().nonnegative(),
      similarity: z.number().min(0).max(100),
    }),
  ),
  financialMetrics: z.object({
    estimatedValue: z.number().positive(),
    estimatedRent: z.number().positive(),
    capRate: z.number().nonnegative(),
    cashOnCashReturn: z.number(),
    grossRentMultiplier: z.number().positive(),
    netOperatingIncome: z.number(),
    operatingExpenseRatio: z.number().min(0).max(1),
    debtServiceCoverageRatio: z.number().positive(),
    breakEvenRatio: z.number().positive(),
  }),
})

export type PropertyInvestmentAnalysis = z.infer<typeof PropertyInvestmentAnalysisSchema>

// Saved property schema
export const SavedPropertySchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  user_id: z.string().uuid(),
  listing_id: z.string().uuid(),
  notes: z.string().nullable(),
})

export type SavedProperty = z.infer<typeof SavedPropertySchema>
