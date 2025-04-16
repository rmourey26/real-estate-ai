"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface ValuationHistoryProps {
  propertyId: string
  listingPrice: number
}

export function ValuationHistory({ propertyId, listingPrice }: ValuationHistoryProps) {
  const [loading, setLoading] = useState(true)
  const [valuationData, setValuationData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchValuationData = async () => {
      try {
        setLoading(true)

        // In a real implementation, this would call your API
        // For now, we'll simulate a delay and return mock data
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Generate mock historical valuation data
        const baseValue = listingPrice
        const historicalMonths = 12
        const historicalValues = []

        // Generate historical values with some random fluctuation
        for (let i = historicalMonths; i >= 0; i--) {
          const date = new Date()
          date.setMonth(date.getMonth() - i)

          // Random fluctuation between -2% and +2% month-to-month
          const fluctuation = 1 + (Math.random() * 4 - 2) / 100

          // Cumulative growth of about 3-5% annually
          const growthFactor = 1 + ((5 / 12) * (historicalMonths - i)) / 100

          const value = Math.round(baseValue * fluctuation * growthFactor)

          historicalValues.push({
            date: date.toISOString().split("T")[0],
            value,
          })
        }

        setValuationData({
          estimatedValue: Math.round(baseValue * 1.02), // Slightly higher than listing price
          valuationRange: {
            low: Math.round(baseValue * 0.95),
            high: Math.round(baseValue * 1.08),
          },
          lastUpdated: new Date().toISOString(),
          historicalValues,
          comparableProperties: [
            {
              address: "123 Nearby St",
              price: Math.round(baseValue * 0.98),
              bedrooms: 3,
              bathrooms: 2,
              squareFeet: 1850,
              distanceMiles: 0.3,
              daysAgo: 15,
            },
            {
              address: "456 Similar Ave",
              price: Math.round(baseValue * 1.05),
              bedrooms: 3,
              bathrooms: 2.5,
              squareFeet: 2050,
              distanceMiles: 0.5,
              daysAgo: 22,
            },
            {
              address: "789 Comparable Ln",
              price: Math.round(baseValue * 1.02),
              bedrooms: 4,
              bathrooms: 2,
              squareFeet: 2100,
              distanceMiles: 0.7,
              daysAgo: 8,
            },
          ],
        })

        setLoading(false)
      } catch (err) {
        console.error("Error fetching valuation data:", err)
        setError("Failed to load valuation data")
        setLoading(false)
      }
    }

    fetchValuationData()
  }, [propertyId, listingPrice])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading valuation data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  // Calculate if the property is undervalued or overvalued
  const valuationDifference = valuationData.estimatedValue - listingPrice
  const valuationPercentage = (valuationDifference / listingPrice) * 100
  const isUndervalued = valuationDifference > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Valuation</CardTitle>
        <CardDescription>Estimated market value and historical trends</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Price History</TabsTrigger>
            <TabsTrigger value="comps">Comparable Sales</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Estimated Market Value</h3>
                <Badge variant={isUndervalued ? "default" : "destructive"}>
                  {isUndervalued ? "Undervalued" : "Overvalued"}
                </Badge>
              </div>

              <div className="text-3xl font-bold">${valuationData.estimatedValue.toLocaleString()}</div>

              <div className="flex items-center gap-2">
                <span className={`text-sm ${isUndervalued ? "text-green-600" : "text-red-600"}`}>
                  {isUndervalued ? "+" : ""}
                  {valuationPercentage.toFixed(1)}% {isUndervalued ? "above" : "below"} listing price
                </span>
                <span className="text-xs text-muted-foreground">
                  Updated {new Date(valuationData.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Valuation Range</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Low</span>
                <div className="flex-1 h-2 bg-muted rounded-full relative">
                  <div
                    className="absolute h-4 w-4 bg-primary rounded-full top-1/2 -translate-y-1/2"
                    style={{
                      left: `${
                        ((listingPrice - valuationData.valuationRange.low) /
                          (valuationData.valuationRange.high - valuationData.valuationRange.low)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-muted-foreground">High</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>${valuationData.valuationRange.low.toLocaleString()}</span>
                <span>${valuationData.valuationRange.high.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <h3 className="font-semibold">Deal Analysis</h3>
              <p className="text-sm">
                {isUndervalued
                  ? `This property appears to be undervalued by approximately $${Math.abs(valuationDifference).toLocaleString()} (${Math.abs(valuationPercentage).toFixed(1)}%) compared to our estimated market value. This suggests a potential good deal for buyers.`
                  : `This property appears to be overvalued by approximately $${Math.abs(valuationDifference).toLocaleString()} (${Math.abs(valuationPercentage).toFixed(1)}%) compared to our estimated market value. Buyers may want to negotiate the price.`}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">12-Month Price History</h3>
              <div className="h-[200px] w-full relative">
                {/* This would be a chart in a real implementation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">Price history chart would appear here</p>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="font-semibold">Historical Values</h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {valuationData.historicalValues.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-1 border-b last:border-0">
                      <span>
                        {new Date(item.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </span>
                      <span className="font-semibold">${item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comps" className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Comparable Properties</h3>
              <div className="space-y-4">
                {valuationData.comparableProperties.map((property: any, index: number) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between">
                      <h4 className="font-semibold">{property.address}</h4>
                      <span className="text-sm">{property.distanceMiles} miles away</span>
                    </div>
                    <div className="mt-1 flex justify-between">
                      <span className="font-semibold">${property.price.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">Sold {property.daysAgo} days ago</span>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {property.bedrooms} bd | {property.bathrooms} ba | {property.squareFeet} sqft
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
