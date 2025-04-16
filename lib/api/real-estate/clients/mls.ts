import { config } from "@/lib/config"
import type { PropertyDetails } from "../types"

class MLSApiClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = config.mls.apiKey
    this.baseUrl = config.mls.baseUrl
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error("MLS API key is not configured")
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
      throw new Error(`MLS API error (${response.status}): ${errorText}`)
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
      if (params.bedrooms) searchParams.minBedrooms = String(params.bedrooms)
      if (params.bathrooms) searchParams.minBathrooms = String(params.bathrooms)
      if (params.propertyType) searchParams.propertyType = params.propertyType

      const data = await this.makeRequest<any>("/properties", searchParams)

      return (data.properties || []).map((item: any) => ({
        id: item.listingId || "",
        address: item.address?.full || "",
        city: item.address?.city || "",
        state: item.address?.state || "",
        zipCode: item.address?.zip || "",
        price: item.listPrice || 0,
        bedrooms: item.bedrooms || 0,
        bathrooms: item.bathrooms || 0,
        squareFeet: item.squareFeet || 0,
        yearBuilt: item.yearBuilt || 0,
        propertyType: item.propertyType?.toLowerCase() || "unknown",
        listingStatus: item.status?.toLowerCase() || "unknown",
        description: item.remarks || "",
        features: item.features || [],
        images: item.photos || [],
        latitude: item.geo?.lat || 0,
        longitude: item.geo?.lng || 0,
        daysOnMarket: item.daysOnMarket || 0,
        listingDate: item.listDate || "",
        source: "mls",
      }))
    } catch (error) {
      console.error("Error searching MLS properties:", error)
      throw error
    }
  }

  async getPropertyDetails(listingId: string): Promise<PropertyDetails> {
    try {
      const data = await this.makeRequest<any>(`/properties/${listingId}`)

      return {
        id: data.listingId || "",
        address: data.address?.full || "",
        city: data.address?.city || "",
        state: data.address?.state || "",
        zipCode: data.address?.zip || "",
        price: data.listPrice || 0,
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        squareFeet: data.squareFeet || 0,
        yearBuilt: data.yearBuilt || 0,
        propertyType: data.propertyType?.toLowerCase() || "unknown",
        listingStatus: data.status?.toLowerCase() || "unknown",
        description: data.remarks || "",
        features: data.features || [],
        images: data.photos || [],
        latitude: data.geo?.lat || 0,
        longitude: data.geo?.lng || 0,
        daysOnMarket: data.daysOnMarket || 0,
        listingDate: data.listDate || "",
        source: "mls",
      }
    } catch (error) {
      console.error("Error fetching MLS property details:", error)
      throw error
    }
  }
}

export const mlsClient = new MLSApiClient()
