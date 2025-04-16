import { config } from "@/lib/config"
import type { PropertyDetails, MarketTrend } from "../types"

class RedfinApiClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = config.redfin.apiKey
    this.baseUrl = config.redfin.baseUrl
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error("Redfin API key is not configured")
    }

    const url = new URL(`${this.baseUrl}${endpoint}`)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Redfin API error (${response.status}): ${errorText}`)
    }

    return response.json() as Promise<T>
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
      const searchParams: Record<string, string> = {
        location: params.location,
        limit: String(params.limit || 10),
      }

      if (params.minPrice) searchParams.minPrice = String(params.minPrice)
      if (params.maxPrice) searchParams.maxPrice = String(params.maxPrice)
      if (params.bedrooms) searchParams.minBeds = String(params.bedrooms)
      if (params.bathrooms) searchParams.minBaths = String(params.bathrooms)
      if (params.propertyType) searchParams.propertyType = params.propertyType

      const data = await this.makeRequest<any>("/properties", searchParams)

      return (data.properties || []).map((item: any) => ({
        id: item.mlsId || "",
        address: item.address?.line || "",
        city: item.address?.city || "",
        state: item.address?.state || "",
        zipCode: item.address?.postalCode || "",
        price: item.price?.list || 0,
        bedrooms: item.beds || 0,
        bathrooms: item.baths || 0,
        squareFeet: item.livingArea || 0,
        yearBuilt: item.yearBuilt || 0,
        propertyType: item.propertyType?.toLowerCase() || "unknown",
        listingStatus: item.status?.toLowerCase() || "unknown",
        description: item.description || "",
        features: item.features || [],
        images: item.media?.map((media: any) => media.url) || [],
        latitude: item.location?.latitude || 0,
        longitude: item.location?.longitude || 0,
        daysOnMarket: item.daysOnMarket || 0,
        listingDate: item.listDate || "",
        source: "redfin",
      }))
    } catch (error) {
      console.error("Error searching Redfin properties:", error)
      throw error
    }
  }

  async getMarketTrends(params: {
    region: string
    regionType?: string
    months?: number
  }): Promise<MarketTrend[]> {
    try {
      const searchParams: Record<string, string> = {
        region: params.region,
        months: String(params.months || 12),
      }

      if (params.regionType) searchParams.regionType = params.regionType

      const data = await this.makeRequest<any>("/market-trends", searchParams)

      return (data.trends || []).map((item: any) => ({
        region: item.region || "",
        regionType: item.regionType || "city",
        medianPrice: item.medianPrice || 0,
        priceChangePct: item.priceChangePct || 0,
        avgDaysOnMarket: item.avgDaysOnMarket || 0,
        inventoryCount: item.inventoryCount || 0,
        month: item.month || 0,
        year: item.year || 0,
        source: "redfin",
      }))
    } catch (error) {
      console.error("Error fetching Redfin market trends:", error)
      throw error
    }
  }

  async getNeighborhoodInfo(params: {
    city: string
    state: string
    zipCode?: string
  }): Promise<any> {
    try {
      const searchParams: Record<string, string> = {
        city: params.city,
        state: params.state,
      }

      if (params.zipCode) searchParams.zipCode = params.zipCode

      return this.makeRequest<any>("/neighborhood", searchParams)
    } catch (error) {
      console.error("Error fetching Redfin neighborhood info:", error)
      throw error
    }
  }
}

export const redfinClient = new RedfinApiClient()
