import { config } from "@/lib/config"
import type { PropertyValuation, PropertyDetails } from "../types"

class ZillowApiClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = config.zillow.apiKey
    this.baseUrl = config.zillow.baseUrl
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error("Zillow API key is not configured")
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
      throw new Error(`Zillow API error (${response.status}): ${errorText}`)
    }

    return response.json() as Promise<T>
  }

  async getPropertyValuation(address: string, zipCode: string): Promise<PropertyValuation> {
    try {
      const data = await this.makeRequest<any>("/zestimate", {
        address,
        zipcode: zipCode,
      })

      return {
        propertyId: data.zpid || "",
        estimatedValue: data.zestimate || 0,
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
        source: "zillow",
      }
    } catch (error) {
      console.error("Error fetching Zillow property valuation:", error)
      throw error
    }
  }

  async getPropertyDetails(zpid: string): Promise<PropertyDetails> {
    try {
      const data = await this.makeRequest<any>(`/property/${zpid}`)

      return {
        id: data.zpid || "",
        address: data.address?.streetAddress || "",
        city: data.address?.city || "",
        state: data.address?.state || "",
        zipCode: data.address?.zipcode || "",
        price: data.price || 0,
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        squareFeet: data.livingArea || 0,
        yearBuilt: data.yearBuilt || 0,
        propertyType: data.homeType?.toLowerCase() || "unknown",
        listingStatus: data.homeStatus?.toLowerCase() || "unknown",
        description: data.description || "",
        features: data.homeFactsAndFeatures || [],
        images: data.photos?.map((photo: any) => photo.url) || [],
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        daysOnMarket: data.daysOnZillow || 0,
        listingDate: data.datePosted || "",
        source: "zillow",
      }
    } catch (error) {
      console.error("Error fetching Zillow property details:", error)
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
      const searchParams: Record<string, string> = {
        location: params.location,
        limit: String(params.limit || 10),
      }

      if (params.minPrice) searchParams.minPrice = String(params.minPrice)
      if (params.maxPrice) searchParams.maxPrice = String(params.maxPrice)
      if (params.bedrooms) searchParams.beds = String(params.bedrooms)
      if (params.bathrooms) searchParams.baths = String(params.bathrooms)
      if (params.propertyType) searchParams.homeType = params.propertyType

      const data = await this.makeRequest<any>("/search", searchParams)

      return (data.results || []).map((item: any) => ({
        id: item.zpid || "",
        address: item.address?.streetAddress || "",
        city: item.address?.city || "",
        state: item.address?.state || "",
        zipCode: item.address?.zipcode || "",
        price: item.price || 0,
        bedrooms: item.bedrooms || 0,
        bathrooms: item.bathrooms || 0,
        squareFeet: item.livingArea || 0,
        yearBuilt: item.yearBuilt || 0,
        propertyType: item.homeType?.toLowerCase() || "unknown",
        listingStatus: item.homeStatus?.toLowerCase() || "unknown",
        description: item.description || "",
        features: [],
        images: [item.imgSrc].filter(Boolean),
        latitude: item.latitude || 0,
        longitude: item.longitude || 0,
        daysOnMarket: item.daysOnZillow || 0,
        listingDate: item.datePosted || "",
        source: "zillow",
      }))
    } catch (error) {
      console.error("Error searching Zillow properties:", error)
      throw error
    }
  }
}

export const zillowClient = new ZillowApiClient()
