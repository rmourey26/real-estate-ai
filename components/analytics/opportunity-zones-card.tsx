"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle, TrendingUp, MapPin } from "lucide-react"
import type { RepliersOpportunityZone } from "@/lib/api/real-estate"

interface OpportunityZonesCardProps {
  region: string
  regionType?: string
}

export function OpportunityZonesCard({ region, regionType }: OpportunityZonesCardProps) {
  const [loading, setLoading] = useState(true)
  const [zones, setZones] = useState<RepliersOpportunityZone[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOpportunityZones = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/market/opportunity-zones?region=${encodeURIComponent(region)}${
            regionType ? `&regionType=${regionType}` : ""
          }`,
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch opportunity zones: ${response.statusText}`)
        }

        const data = await response.json()
        setZones(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching opportunity zones:", err)
        setError("Failed to load opportunity zones")
        setLoading(false)
      }
    }

    fetchOpportunityZones()
  }, [region, regionType])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading opportunity zones...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !zones || zones.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>{error || "No opportunity zones found for this region"}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort zones by opportunity score
  const sortedZones = [...zones].sort((a, b) => b.opportunityScore - a.opportunityScore)
  const topZone = sortedZones[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Opportunity Zones</CardTitle>
        <CardDescription>High-potential areas for real estate investment in {region}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Top Opportunities</TabsTrigger>
            <TabsTrigger value="details">Zone Details</TabsTrigger>
            <TabsTrigger value="strategy">Investment Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">{topZone.region}</h3>
                </div>
                <Badge
                  variant="outline"
                  className={`${
                    topZone.opportunityScore >= 85
                      ? "bg-green-50 text-green-700"
                      : topZone.opportunityScore >= 70
                        ? "bg-blue-50 text-blue-700"
                        : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {topZone.opportunityScore}/100
                </Badge>
              </div>
              <Progress value={topZone.opportunityScore} className="mt-2 h-1.5" />

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Median Price</p>
                  <p className="font-medium">${topZone.metrics.medianPrice.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Price Change</p>
                  <p className="font-medium">
                    {topZone.metrics.priceChangePct >= 0 ? "+" : ""}
                    {topZone.metrics.priceChangePct}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Rental Demand</p>
                  <p className="font-medium">{topZone.metrics.rentalDemand}/100</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Investor Activity</p>
                  <p className="font-medium">{topZone.metrics.investorActivity}/100</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium">Recommended Property Types</h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {topZone.recommendedPropertyTypes.map((type, index) => (
                    <Badge key={index} variant="secondary">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium">Key Insights</h4>
                <ul className="mt-1 space-y-1">
                  {topZone.insights.slice(0, 3).map((insight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <TrendingUp className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {sortedZones.slice(1, 3).map((zone, index) => (
                <div key={index} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{zone.region}</h3>
                    <Badge variant="outline">{zone.opportunityScore}/100</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground">Median Price</p>
                      <p>${zone.metrics.medianPrice.toLocaleString()}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground">Price Change</p>
                      <p>
                        {zone.metrics.priceChangePct >= 0 ? "+" : ""}
                        {zone.metrics.priceChangePct}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">Recommended</p>
                    <div className="mt-0.5 flex flex-wrap gap-1">
                      {zone.recommendedPropertyTypes.slice(0, 2).map((type, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className="space-y-4">
              {sortedZones.map((zone, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{zone.region}</h3>
                    <Badge
                      variant="outline"
                      className={`${
                        zone.opportunityScore >= 85
                          ? "bg-green-50 text-green-700"
                          : zone.opportunityScore >= 70
                            ? "bg-blue-50 text-blue-700"
                            : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {zone.opportunityScore}/100
                    </Badge>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Median Price</p>
                      <p className="font-medium">${zone.metrics.medianPrice.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Price Change</p>
                      <p
                        className={`font-medium ${zone.metrics.priceChangePct >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {zone.metrics.priceChangePct >= 0 ? "+" : ""}
                        {zone.metrics.priceChangePct}%
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Days on Market</p>
                      <p className="font-medium">{zone.metrics.avgDaysOnMarket} days</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Inventory</p>
                      <p className="font-medium">{zone.metrics.inventoryCount} listings</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Rental Demand</p>
                      <p className="font-medium">{zone.metrics.rentalDemand}/100</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Job Growth</p>
                      <p className="font-medium">{zone.metrics.jobGrowth}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Population Growth</p>
                      <p className="font-medium">{zone.metrics.populationGrowth}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Income Growth</p>
                      <p className="font-medium">{zone.metrics.incomeGrowth}%</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-sm font-medium">Recommended Property Types</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {zone.recommendedPropertyTypes.map((type, i) => (
                        <Badge key={i} variant="secondary">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium">Key Insights</h4>
                      <ul className="mt-1 space-y-1">
                        {zone.insights.map((insight, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs">
                            <TrendingUp className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Risk Factors</h4>
                      <ul className="mt-1 space-y-1">
                        {zone.riskFactors.map((risk, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs">
                            <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-yellow-500" />
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-4">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Short-Term Strategy (6-12 months)</h3>
                <p className="mt-2 text-sm">
                  Focus on properties in {topZone.region} with immediate cash flow potential. Target{" "}
                  {topZone.recommendedPropertyTypes[0]} properties priced below market value that require minimal
                  renovation. The strong rental demand ({topZone.metrics.rentalDemand}/100) suggests quick tenant
                  placement and stable income.
                </p>
                <div className="mt-3">
                  <h4 className="text-sm font-medium">Action Steps:</h4>
                  <ol className="mt-1 space-y-1 pl-5 text-sm">
                    <li className="list-decimal">
                      Set up property alerts for {topZone.recommendedPropertyTypes[0]} properties in {topZone.region}
                    </li>
                    <li className="list-decimal">
                      Focus on properties priced 5-10% below market value with good condition
                    </li>
                    <li className="list-decimal">
                      Prepare financing options with focus on maximizing cash flow (consider 30-year fixed)
                    </li>
                    <li className="list-decimal">Build relationships with property managers in the area</li>
                  </ol>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Medium-Term Strategy (1-3 years)</h3>
                <p className="mt-2 text-sm">
                  Expand portfolio to include properties in {sortedZones[1]?.region || "secondary opportunity zones"}{" "}
                  with value-add potential. The {sortedZones[1]?.metrics.priceChangePct || "positive"}% price
                  appreciation trend indicates good potential for equity growth. Consider{" "}
                  {sortedZones[1]?.recommendedPropertyTypes[0] || "multi-family"} properties that can benefit from
                  strategic improvements.
                </p>
                <div className="mt-3">
                  <h4 className="text-sm font-medium">Action Steps:</h4>
                  <ol className="mt-1 space-y-1 pl-5 text-sm">
                    <li className="list-decimal">
                      Identify properties with renovation potential to force appreciation
                    </li>
                    <li className="list-decimal">Develop relationships with contractors and renovation specialists</li>
                    <li className="list-decimal">
                      Consider refinancing initial properties to extract equity for new acquisitions
                    </li>
                    <li className="list-decimal">
                      Monitor job growth and development projects that could impact property values
                    </li>
                  </ol>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Long-Term Strategy (3-5+ years)</h3>
                <p className="mt-2 text-sm">
                  Position portfolio for maximum appreciation by acquiring properties in emerging neighborhoods before
                  major development projects complete. The strong job growth ({topZone.metrics.jobGrowth}%) and
                  population growth ({topZone.metrics.populationGrowth}%) indicate long-term demand growth. Consider
                  larger multi-family or commercial properties for portfolio diversification.
                </p>
                <div className="mt-3">
                  <h4 className="text-sm font-medium">Action Steps:</h4>
                  <ol className="mt-1 space-y-1 pl-5 text-sm">
                    <li className="list-decimal">
                      Research upcoming infrastructure and development projects in the region
                    </li>
                    <li className="list-decimal">
                      Consider 1031 exchanges to upgrade to larger, higher-quality properties
                    </li>
                    <li className="list-decimal">Explore commercial property opportunities as portfolio grows</li>
                    <li className="list-decimal">
                      Develop exit strategies for each property based on market cycle position
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
