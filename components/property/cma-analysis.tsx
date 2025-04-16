"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface CMAAnalysisProps {
  propertyId: string
}

interface ComparableProperty {
  id: string
  address: string
  price: number
  pricePerSqFt: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  yearBuilt: number
  daysOnMarket: number
  distance: string
}

interface CMAResult {
  subjectProperty: {
    id: string
    address: string
    price: number
    pricePerSqFt: number
    bedrooms: number
    bathrooms: number
    squareFeet: number
    yearBuilt: number
  }
  comparableProperties: ComparableProperty[]
  analysis: {
    avgPrice: number
    avgPricePerSqFt: number
    avgDaysOnMarket: number
    estimatedValueBySqFt: number
    priceDifference: number
    priceDifferencePercent: number
    conclusion: string
  }
}

export function CMAAnalysis({ propertyId }: CMAAnalysisProps) {
  const [loading, setLoading] = useState(true)
  const [cmaData, setCmaData] = useState<CMAResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCMAData = async () => {
      try {
        setLoading(true)

        const response = await fetch(`/api/property/cma?propertyId=${propertyId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch CMA data: ${response.statusText}`)
        }

        const data = await response.json()
        setCmaData(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching CMA data:", err)
        setError("Failed to load comparative market analysis")
        setLoading(false)
      }
    }

    fetchCMAData()
  }, [propertyId])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading comparative market analysis...</p>
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

  if (!cmaData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p>No comparable properties found for this property.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { subjectProperty, comparableProperties, analysis } = cmaData

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparative Market Analysis</CardTitle>
        <CardDescription>Analysis of comparable properties in the area</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Subject Property</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-semibold">${subjectProperty.price.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Price/Sq.Ft.</p>
              <p className="font-semibold">${subjectProperty.pricePerSqFt}/sqft</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Size</p>
              <p className="font-semibold">{subjectProperty.squareFeet.toLocaleString()} sqft</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Bed/Bath</p>
              <p className="font-semibold">
                {subjectProperty.bedrooms} bd / {subjectProperty.bathrooms} ba
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Comparable Properties</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">$/Sq.Ft.</TableHead>
                  <TableHead className="text-right">Sq.Ft.</TableHead>
                  <TableHead className="text-right">Bed/Bath</TableHead>
                  <TableHead className="text-right">Year</TableHead>
                  <TableHead className="text-right">DOM</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparableProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.address}</TableCell>
                    <TableCell className="text-right">${property.price.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${property.pricePerSqFt}</TableCell>
                    <TableCell className="text-right">{property.squareFeet.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {property.bedrooms} / {property.bathrooms}
                    </TableCell>
                    <TableCell className="text-right">{property.yearBuilt}</TableCell>
                    <TableCell className="text-right">{property.daysOnMarket}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg. Comparable Price</p>
              <p className="font-semibold">${analysis.avgPrice.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg. Price/Sq.Ft.</p>
              <p className="font-semibold">${Math.round(analysis.avgPricePerSqFt)}/sqft</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg. Days on Market</p>
              <p className="font-semibold">{Math.round(analysis.avgDaysOnMarket)} days</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estimated Value</p>
              <p className="font-semibold">${analysis.estimatedValueBySqFt.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Price Difference</p>
              <p
                className={`font-semibold ${analysis.priceDifference < 0 ? "text-green-600" : analysis.priceDifference > 0 ? "text-red-600" : ""}`}
              >
                ${Math.abs(analysis.priceDifference).toLocaleString()} {analysis.priceDifference < 0 ? "under" : "over"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Difference %</p>
              <p
                className={`font-semibold ${analysis.priceDifferencePercent < 0 ? "text-green-600" : analysis.priceDifferencePercent > 0 ? "text-red-600" : ""}`}
              >
                {Math.abs(analysis.priceDifferencePercent)}% {analysis.priceDifferencePercent < 0 ? "under" : "over"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Conclusion</h3>
          <p>{analysis.conclusion}</p>
          <div className="mt-4">
            <Badge
              variant="outline"
              className={`
                ${
                  analysis.priceDifferencePercent <= -5
                    ? "bg-green-50 text-green-700 hover:bg-green-50"
                    : analysis.priceDifferencePercent >= 5
                      ? "bg-red-50 text-red-700 hover:bg-red-50"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-50"
                }
              `}
            >
              {analysis.priceDifferencePercent <= -5
                ? "Undervalued"
                : analysis.priceDifferencePercent >= 5
                  ? "Overvalued"
                  : "Fairly Priced"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
