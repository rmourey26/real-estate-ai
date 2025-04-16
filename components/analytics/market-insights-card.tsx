"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import type { RepliersMarketInsight } from "@/lib/api/real-estate"

interface MarketInsightsCardProps {
  region: string
  regionType?: string
}

export function MarketInsightsCard({ region, regionType }: MarketInsightsCardProps) {
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState<RepliersMarketInsight | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/market/insights?region=${encodeURIComponent(region)}${regionType ? `&regionType=${regionType}` : ""}`,
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch market insights: ${response.statusText}`)
        }

        const data = await response.json()
        setInsights(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching market insights:", err)
        setError("Failed to load market insights")
        setLoading(false)
      }
    }

    fetchInsights()
  }, [region, regionType])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading market insights...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !insights) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>{error || "Failed to load market insights"}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Insights: {insights.region}</CardTitle>
        <CardDescription>
          Comprehensive market analysis and forecasts for {insights.regionType || "region"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Median Price</h3>
                <p className="text-2xl font-bold">${insights.metrics.medianPrice.toLocaleString()}</p>
                <div className="flex items-center gap-1">
                  {insights.metrics.priceChangePct >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={insights.metrics.priceChangePct >= 0 ? "text-green-500" : "text-red-500"}
                  >{`${insights.metrics.priceChangePct >= 0 ? "+" : ""}${insights.metrics.priceChangePct}%`}</span>
                  <span className="text-xs text-muted-foreground">year over year</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Market Heat Index</h3>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{insights.metrics.marketHeatIndex || 65}/100</p>
                  <Badge
                    variant="outline"
                    className={`${
                      (insights.metrics.marketHeatIndex || 65) > 80
                        ? "bg-red-50 text-red-700"
                        : (insights.metrics.marketHeatIndex || 65) > 60
                          ? "bg-orange-50 text-orange-700"
                          : (insights.metrics.marketHeatIndex || 65) > 40
                            ? "bg-blue-50 text-blue-700"
                            : "bg-green-50 text-green-700"
                    }`}
                  >
                    {(insights.metrics.marketHeatIndex || 65) > 80
                      ? "Very Hot"
                      : (insights.metrics.marketHeatIndex || 65) > 60
                        ? "Hot"
                        : (insights.metrics.marketHeatIndex || 65) > 40
                          ? "Balanced"
                          : "Cool"}
                  </Badge>
                </div>
                <Progress value={insights.metrics.marketHeatIndex || 65} className="h-2" />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Avg. Days on Market</h3>
                <p className="text-2xl font-bold">{insights.metrics.avgDaysOnMarket} days</p>
                <p className="text-xs text-muted-foreground">
                  {insights.metrics.avgDaysOnMarket < 30
                    ? "Fast-moving market"
                    : insights.metrics.avgDaysOnMarket > 60
                      ? "Slower-moving market"
                      : "Average market pace"}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Inventory</h3>
                <p className="text-2xl font-bold">{insights.metrics.inventoryCount} listings</p>
                <p className="text-xs text-muted-foreground">
                  {insights.metrics.inventoryCount < 100
                    ? "Low inventory market"
                    : insights.metrics.inventoryCount > 500
                      ? "High inventory market"
                      : "Moderate inventory"}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="font-medium">Market Conditions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Affordability</h4>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-medium">
                      {(insights.metrics.affordabilityIndex || 65) > 80
                        ? "Highly Affordable"
                        : (insights.metrics.affordabilityIndex || 65) > 60
                          ? "Affordable"
                          : (insights.metrics.affordabilityIndex || 65) > 40
                            ? "Moderately Affordable"
                            : "Less Affordable"}
                    </span>
                    <Badge variant="outline">
                      {insights.metrics.affordabilityIndex ? `${insights.metrics.affordabilityIndex}/100` : "65/100"}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-lg border p-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Rental Market</h4>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-medium">
                      {insights.metrics.rentYield
                        ? `${insights.metrics.rentYield}% Yield`
                        : insights.metrics.medianRentPrice
                          ? `$${insights.metrics.medianRentPrice.toLocaleString()}/mo`
                          : "Strong Demand"}
                    </span>
                    <Badge variant="outline">
                      {insights.metrics.priceToRentRatio
                        ? `${insights.metrics.priceToRentRatio.toFixed(1)}x P/R Ratio`
                        : "Good for Investors"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Median Price</h3>
                <p className="text-xl font-bold">${insights.metrics.medianPrice.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Price Change</h3>
                <p
                  className={`text-xl font-bold ${insights.metrics.priceChangePct >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {insights.metrics.priceChangePct >= 0 ? "+" : ""}
                  {insights.metrics.priceChangePct}%
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Avg. Days on Market</h3>
                <p className="text-xl font-bold">{insights.metrics.avgDaysOnMarket} days</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Inventory Count</h3>
                <p className="text-xl font-bold">{insights.metrics.inventoryCount} listings</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Sales Volume</h3>
                <p className="text-xl font-bold">{insights.metrics.salesVolume} sales</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Median Rent</h3>
                <p className="text-xl font-bold">
                  $
                  {insights.metrics.medianRentPrice?.toLocaleString() ||
                    Math.round(insights.metrics.medianPrice * 0.005).toLocaleString()}
                  /mo
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Rent Yield</h3>
                <p className="text-xl font-bold">{insights.metrics.rentYield?.toFixed(1) || "5.8"}%</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Price to Rent Ratio</h3>
                <p className="text-xl font-bold">{insights.metrics.priceToRentRatio?.toFixed(1) || "17.2"}x</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="forecast" className="space-y-4">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Short-Term Forecast (3-6 months)</h3>
                  <Badge
                    variant="outline"
                    className={`${insights.forecast.shortTerm.priceChangePct >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    {insights.forecast.shortTerm.priceChangePct >= 0 ? "+" : ""}
                    {insights.forecast.shortTerm.priceChangePct}%
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Confidence Level</span>
                  <span className="font-medium">{insights.forecast.shortTerm.confidence}%</span>
                </div>
                <Progress value={insights.forecast.shortTerm.confidence} className="mt-1 h-1.5" />
                <p className="mt-2 text-sm">
                  {insights.forecast.shortTerm.priceChangePct >= 2
                    ? "Strong growth expected in the short term. Consider acting quickly on investment opportunities."
                    : insights.forecast.shortTerm.priceChangePct >= 0
                      ? "Modest growth expected in the short term. Good time to evaluate specific opportunities."
                      : "Market correction expected in the short term. Consider waiting for better entry points."}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Medium-Term Forecast (1-2 years)</h3>
                  <Badge
                    variant="outline"
                    className={`${insights.forecast.mediumTerm.priceChangePct >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    {insights.forecast.mediumTerm.priceChangePct >= 0 ? "+" : ""}
                    {insights.forecast.mediumTerm.priceChangePct}%
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Confidence Level</span>
                  <span className="font-medium">{insights.forecast.mediumTerm.confidence}%</span>
                </div>
                <Progress value={insights.forecast.mediumTerm.confidence} className="mt-1 h-1.5" />
                <p className="mt-2 text-sm">
                  {insights.forecast.mediumTerm.priceChangePct >= 5
                    ? "Strong appreciation expected over the next 1-2 years. Good time for buy-and-hold strategies."
                    : insights.forecast.mediumTerm.priceChangePct >= 2
                      ? "Moderate appreciation expected over the next 1-2 years. Focus on value-add opportunities."
                      : insights.forecast.mediumTerm.priceChangePct >= 0
                        ? "Modest growth expected over the next 1-2 years. Be selective with investments."
                        : "Market challenges expected over the next 1-2 years. Focus on cash flow rather than appreciation."}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Long-Term Forecast (3-5 years)</h3>
                  <Badge
                    variant="outline"
                    className={`${insights.forecast.longTerm.priceChangePct >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    {insights.forecast.longTerm.priceChangePct >= 0 ? "+" : ""}
                    {insights.forecast.longTerm.priceChangePct}%
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Confidence Level</span>
                  <span className="font-medium">{insights.forecast.longTerm.confidence}%</span>
                </div>
                <Progress value={insights.forecast.longTerm.confidence} className="mt-1 h-1.5" />
                <p className="mt-2 text-sm">
                  {insights.forecast.longTerm.priceChangePct >= 10
                    ? "Strong long-term growth potential. Excellent market for buy-and-hold strategies."
                    : insights.forecast.longTerm.priceChangePct >= 5
                      ? "Good long-term growth potential. Consider long-term investment horizons."
                      : insights.forecast.longTerm.priceChangePct >= 0
                        ? "Moderate long-term growth potential. Focus on properties with multiple exit strategies."
                        : "Challenging long-term outlook. Consider other markets or focus on cash flow properties."}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
