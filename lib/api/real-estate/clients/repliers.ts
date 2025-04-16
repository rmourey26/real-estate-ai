import { config } from "@/lib/config"
import type { PropertyDetails, MarketTrend, PropertyValuation, NeighborhoodInfo } from "../types"

// Define Repliers-specific types
export interface RepliersMarketInsight {
  region: string
  regionType: string
  period: string
  metrics: {
    medianPrice: number
    priceChangePct: number
    avgDaysOnMarket: number
    inventoryCount: number
    salesVolume: number
    medianRentPrice?: number
    rentYield?: number
    priceToRentRatio?: number
    affordabilityIndex?: number
    marketHeatIndex?: number
  }
  forecast: {
    shortTerm: {
      priceChangePct: number
      confidence: number
    }
    mediumTerm: {
      priceChangePct: number
      confidence: number
    }
    longTerm: {
      priceChangePct: number
      confidence: number
    }
  }
}

export interface RepliersPropertyAnalysis {
  propertyId: string
  valuationScore: number // 0-100
  investmentScore: number // 0-100
  rentalScore: number // 0-100
  appreciationScore: number // 0-100
  cashFlowScore: number // 0-100
  riskScore: number // 0-100
  overallScore: number // 0-100
  insights: string[]
  recommendations: string[]
  comparableProperties: {
    id: string
    address: string
    price: number
    pricePerSqFt: number
    bedrooms: number
    bathrooms: number
    squareFeet: number
    yearBuilt: number
    distance: number
    similarity: number // 0-100
  }[]
  financialMetrics: {
    estimatedValue: number
    estimatedRent: number
    capRate: number
    cashOnCashReturn: number
    grossRentMultiplier: number
    netOperatingIncome: number
    operatingExpenseRatio: number
    debtServiceCoverageRatio: number
    breakEvenRatio: number
  }
}

export interface RepliersOpportunityZone {
  region: string
  regionType: string
  opportunityScore: number // 0-100
  metrics: {
    medianPrice: number
    priceChangePct: number
    avgDaysOnMarket: number
    inventoryCount: number
    rentalDemand: number // 0-100
    jobGrowth: number
    populationGrowth: number
    incomeGrowth: number
    newDevelopment: number
    investorActivity: number // 0-100
  }
  insights: string[]
  recommendedPropertyTypes: string[]
  riskFactors: string[]
}

class RepliersApiClient {
  private apiKey: string
  private baseUrl: string
  private region: string

  constructor() {
    this.apiKey = config.repliers.apiKey
    this.baseUrl = config.repliers.baseUrl
    this.region = config.repliers.region
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error("Repliers API key is not configured")
    }

    const url = new URL(`${this.baseUrl}${endpoint}`)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })

    url.searchParams.append("region", this.region)

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Repliers API error (${response.status}): ${errorText}`)
    }

    return response.json() as Promise<T>
  }

  async getPropertyDetails(propertyId: string): Promise<PropertyDetails> {
    try {
      const data = await this.makeRequest<any>(`/properties/${propertyId}`)

      return {
        id: data.id || propertyId,
        address: data.address?.full || "",
        city: data.address?.city || "",
        state: data.address?.state || "",
        zipCode: data.address?.zip || "",
        price: data.price || 0,
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        squareFeet: data.squareFeet || 0,
        yearBuilt: data.yearBuilt || 0,
        propertyType: data.propertyType?.toLowerCase() || "unknown",
        listingStatus: data.status?.toLowerCase() || "unknown",
        description: data.description || "",
        features: data.features || [],
        images: data.images || [],
        latitude: data.location?.latitude || 0,
        longitude: data.location?.longitude || 0,
        daysOnMarket: data.daysOnMarket || 0,
        listingDate: data.listDate || "",
        source: "repliers",
      }
    } catch (error) {
      console.error("Error fetching property details from Repliers:", error)
      throw error
    }
  }

  async searchProperties(params: {
    location: string
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    bathrooms?: number
    propertyType?: string
    limit?: number
  }): Promise<PropertyDetails[]> {
    try {
      const searchParams: Record<string, string | number> = {
        location: params.location,
        limit: params.limit || 10,
      }

      if (params.minPrice) searchParams.minPrice = params.minPrice
      if (params.maxPrice) searchParams.maxPrice = params.maxPrice
      if (params.bedrooms) searchParams.minBedrooms = params.bedrooms
      if (params.bathrooms) searchParams.minBathrooms = params.bathrooms
      if (params.propertyType) searchParams.propertyType = params.propertyType

      const data = await this.makeRequest<any>("/properties/search", searchParams)

      return (data.properties || []).map((item: any) => ({
        id: item.id || "",
        address: item.address?.full || "",
        city: item.address?.city || "",
        state: item.address?.state || "",
        zipCode: item.address?.zip || "",
        price: item.price || 0,
        bedrooms: item.bedrooms || 0,
        bathrooms: item.bathrooms || 0,
        squareFeet: item.squareFeet || 0,
        yearBuilt: item.yearBuilt || 0,
        propertyType: item.propertyType?.toLowerCase() || "unknown",
        listingStatus: item.status?.toLowerCase() || "unknown",
        description: item.description || "",
        features: item.features || [],
        images: item.images || [],
        latitude: item.location?.latitude || 0,
        longitude: item.location?.longitude || 0,
        daysOnMarket: item.daysOnMarket || 0,
        listingDate: item.listDate || "",
        source: "repliers",
      }))
    } catch (error) {
      console.error("Error searching properties from Repliers:", error)
      throw error
    }
  }

  async getPropertyValuation(propertyId: string): Promise<PropertyValuation> {
    try {
      const data = await this.makeRequest<any>(`/properties/${propertyId}/valuation`)

      return {
        propertyId,
        estimatedValue: data.estimatedValue || 0,
        valuationRange: {
          low: data.valuationRange?.low || 0,
          high: data.valuationRange?.high || 0,
        },
        lastUpdated: data.lastUpdated || new Date().toISOString(),
        historicalValues:
          data.historicalValues?.map((item: any) => ({
            date: item.date,
            value: item.value,
          })) || [],
        source: "repliers",
      }
    } catch (error) {
      console.error("Error fetching property valuation from Repliers:", error)
      throw error
    }
  }

  async getMarketTrends(params: {
    region: string
    regionType?: string
    months?: number
  }): Promise<MarketTrend[]> {
    try {
      const searchParams: Record<string, string | number> = {
        region: params.region,
        months: params.months || 12,
      }

      if (params.regionType) searchParams.regionType = params.regionType

      const data = await this.makeRequest<any>("/market/trends", searchParams)

      return (data.trends || []).map((item: any) => ({
        region: item.region || params.region,
        regionType: item.regionType || params.regionType || "city",
        medianPrice: item.medianPrice || 0,
        priceChangePct: item.priceChangePct || 0,
        avgDaysOnMarket: item.avgDaysOnMarket || 0,
        inventoryCount: item.inventoryCount || 0,
        month: item.month || new Date().getMonth() + 1,
        year: item.year || new Date().getFullYear(),
        source: "repliers",
      }))
    } catch (error) {
      console.error("Error fetching market trends from Repliers:", error)
      throw error
    }
  }

  async getNeighborhoodInfo(params: {
    city: string
    state: string
    zipCode?: string
  }): Promise<NeighborhoodInfo> {
    try {
      const searchParams: Record<string, string | number> = {
        city: params.city,
        state: params.state,
      }

      if (params.zipCode) searchParams.zipCode = params.zipCode

      const data = await this.makeRequest<any>("/neighborhood", searchParams)

      return {
        overview: {
          population: data.overview?.population || 0,
          medianIncome: data.overview?.medianIncome || 0,
          medianHomeValue: data.overview?.medianHomeValue || 0,
          costOfLivingIndex: data.overview?.costOfLivingIndex || 0,
        },
        schools:
          data.schools?.map((school: any) => ({
            name: school.name || "",
            type: school.type || "",
            grades: school.grades || "",
            rating: school.rating || 0,
            distance: school.distance || 0,
          })) || [],
        amenities: {
          restaurants: data.amenities?.restaurants || 0,
          groceryStores: data.amenities?.groceryStores || 0,
          parks: data.amenities?.parks || 0,
          gyms: data.amenities?.gyms || 0,
          hospitals: data.amenities?.hospitals || 0,
        },
        transportation: {
          walkScore: data.transportation?.walkScore || 0,
          transitScore: data.transportation?.transitScore || 0,
          bikeScore: data.transportation?.bikeScore || 0,
          averageCommute: data.transportation?.averageCommute || 0,
        },
        crimeRate: {
          overall: data.crimeRate?.overall || "Unknown",
          violent: data.crimeRate?.violent || "Unknown",
          property: data.crimeRate?.property || "Unknown",
          comparedToNational: data.crimeRate?.comparedToNational || "Unknown",
        },
        marketTrends: {
          homeValueTrend: data.marketTrends?.homeValueTrend || "Unknown",
          forecastNextYear: data.marketTrends?.forecastNextYear || "Unknown",
          averageDaysOnMarket: data.marketTrends?.averageDaysOnMarket || 0,
          medianRent: data.marketTrends?.medianRent || 0,
        },
      }
    } catch (error) {
      console.error("Error fetching neighborhood info from Repliers:", error)
      throw error
    }
  }

  // Repliers-specific methods

  async getMarketInsights(params: {
    region: string
    regionType?: string
  }): Promise<RepliersMarketInsight> {
    try {
      const searchParams: Record<string, string | number> = {
        region: params.region,
      }

      if (params.regionType) searchParams.regionType = params.regionType

      return this.makeRequest<RepliersMarketInsight>("/market/insights", searchParams)
    } catch (error) {
      console.error("Error fetching market insights from Repliers:", error)
      throw error
    }
  }

  async getPropertyAnalysis(propertyId: string): Promise<RepliersPropertyAnalysis> {
    try {
      return this.makeRequest<RepliersPropertyAnalysis>(`/properties/${propertyId}/analysis`)
    } catch (error) {
      console.error("Error fetching property analysis from Repliers:", error)
      throw error
    }
  }

  async getOpportunityZones(params: {
    region: string
    regionType?: string
  }): Promise<RepliersOpportunityZone[]> {
    try {
      const searchParams: Record<string, string | number> = {
        region: params.region,
      }

      if (params.regionType) searchParams.regionType = params.regionType

      const data = await this.makeRequest<any>("/market/opportunity-zones", searchParams)
      return data.opportunityZones || []
    } catch (error) {
      console.error("Error fetching opportunity zones from Repliers:", error)
      throw error
    }
  }
}

export const repliersClient = new RepliersApiClient()
