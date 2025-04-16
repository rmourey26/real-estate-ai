"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, School, ShoppingBag, Utensils, ParkingMeterIcon as Park, Hospital, Train } from "lucide-react"

interface NeighborhoodAnalysisProps {
  city: string
  state: string
  zipCode: string
}

export function NeighborhoodAnalysis({ city, state, zipCode }: NeighborhoodAnalysisProps) {
  const [loading, setLoading] = useState(true)
  const [neighborhoodData, setNeighborhoodData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNeighborhoodData = async () => {
      try {
        setLoading(true)

        // In a real implementation, this would call your API
        // For now, we'll simulate a delay and return mock data
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setNeighborhoodData({
          overview: {
            population: 45000,
            medianIncome: 85000,
            medianHomeValue: 450000,
            costOfLivingIndex: 110, // 100 is national average
          },
          schools: [
            {
              name: "Washington Elementary",
              type: "Public",
              grades: "K-5",
              rating: 8.5,
              distance: 0.8,
            },
            {
              name: "Lincoln Middle School",
              type: "Public",
              grades: "6-8",
              rating: 7.9,
              distance: 1.2,
            },
            {
              name: "Roosevelt High School",
              type: "Public",
              grades: "9-12",
              rating: 8.2,
              distance: 1.5,
            },
          ],
          amenities: {
            restaurants: 42,
            groceryStores: 8,
            parks: 5,
            gyms: 6,
            hospitals: 2,
          },
          transportation: {
            walkScore: 72,
            transitScore: 65,
            bikeScore: 68,
            averageCommute: 28, // minutes
          },
          crimeRate: {
            overall: "Low",
            violent: "Very Low",
            property: "Low",
            comparedToNational: "-15%", // 15% below national average
          },
          marketTrends: {
            homeValueTrend: "+4.2% YoY",
            forecastNextYear: "+3.8%",
            averageDaysOnMarket: 18,
            medianRent: 2200,
          },
        })

        setLoading(false)
      } catch (err) {
        console.error("Error fetching neighborhood data:", err)
        setError("Failed to load neighborhood data")
        setLoading(false)
      }
    }

    fetchNeighborhoodData()
  }, [city, state, zipCode])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading neighborhood data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Neighborhood Analysis</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>
              {city}, {state} {zipCode}
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-4 md:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Population</h3>
                <p className="text-2xl">{neighborhoodData.overview.population.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Median Income</h3>
                <p className="text-2xl">${neighborhoodData.overview.medianIncome.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Median Home Value</h3>
                <p className="text-2xl">${neighborhoodData.overview.medianHomeValue.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Cost of Living</h3>
                <p className="text-2xl">{neighborhoodData.overview.costOfLivingIndex}</p>
                <p className="text-xs text-muted-foreground">100 is national average</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Livability Scores</h3>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Walk Score</span>
                  <span className="font-semibold">{neighborhoodData.transportation.walkScore}/100</span>
                </div>
                <Progress value={neighborhoodData.transportation.walkScore} className="h-2" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Transit Score</span>
                  <span className="font-semibold">{neighborhoodData.transportation.transitScore}/100</span>
                </div>
                <Progress value={neighborhoodData.transportation.transitScore} className="h-2" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Bike Score</span>
                  <span className="font-semibold">{neighborhoodData.transportation.bikeScore}/100</span>
                </div>
                <Progress value={neighborhoodData.transportation.bikeScore} className="h-2" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Safety Score</span>
                  <span className="font-semibold">85/100</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schools" className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Nearby Schools</h3>
              <div className="space-y-4">
                {neighborhoodData.schools.map((school: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 border-b pb-3 last:border-0">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <School className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-semibold">{school.name}</h4>
                        <Badge variant="outline">{school.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Grades: {school.grades}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">
                          Rating: <span className="font-semibold">{school.rating}/10</span>
                        </span>
                        <span className="text-sm">{school.distance} miles away</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Button variant="outline" size="sm">
                View All Schools
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="amenities" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Utensils className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Restaurants</p>
                  <p className="font-semibold">{neighborhoodData.amenities.restaurants}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Grocery Stores</p>
                  <p className="font-semibold">{neighborhoodData.amenities.groceryStores}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Park className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Parks</p>
                  <p className="font-semibold">{neighborhoodData.amenities.parks}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Hospital className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hospitals</p>
                  <p className="font-semibold">{neighborhoodData.amenities.hospitals}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Train className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Public Transit</p>
                  <p className="font-semibold">{neighborhoodData.transportation.transitScore}/100</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Average Commute Time</h3>
              <p className="text-lg">{neighborhoodData.transportation.averageCommute} minutes</p>
            </div>
          </TabsContent>

          <TabsContent value="safety" className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold">Crime Rates</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Overall Crime</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                      {neighborhoodData.crimeRate.overall}
                    </Badge>
                    <span className="text-sm text-green-600">
                      {neighborhoodData.crimeRate.comparedToNational} vs. national avg
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Violent Crime</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    {neighborhoodData.crimeRate.violent}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Property Crime</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    {neighborhoodData.crimeRate.property}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Safety Trend</h3>
              <p>Crime rates in this area have decreased by approximately 8% over the past 3 years.</p>
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Home Value Trend</p>
                <p className="text-lg font-semibold text-green-600">{neighborhoodData.marketTrends.homeValueTrend}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Forecast (Next Year)</p>
                <p className="text-lg font-semibold text-green-600">{neighborhoodData.marketTrends.forecastNextYear}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Days on Market</p>
                <p className="text-lg font-semibold">{neighborhoodData.marketTrends.averageDaysOnMarket} days</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Median Rent</p>
                <p className="text-lg font-semibold">${neighborhoodData.marketTrends.medianRent}/mo</p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Market Insights</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This neighborhood is experiencing strong appreciation with limited inventory. Properties are selling
                quickly, often with multiple offers. The rental market is also strong, making this area attractive for
                both homeowners and investors.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
