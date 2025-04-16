"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import type { RepliersPropertyAnalysis } from "@/lib/api/real-estate"

interface InvestmentAnalysisCardProps {
  propertyId: string
}

export function InvestmentAnalysisCard({ propertyId }: InvestmentAnalysisCardProps) {
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState<RepliersPropertyAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/property/analysis?propertyId=${propertyId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch property analysis: ${response.statusText}`)
        }

        const data = await response.json()
        setAnalysis(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching property analysis:", err)
        setError("Failed to load investment analysis")
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [propertyId])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading investment analysis...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !analysis) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>{error || "Failed to load investment analysis"}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Analysis</CardTitle>
        <CardDescription>Comprehensive analysis of this property's investment potential</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Financial Metrics</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="comparables">Comparables</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">Overall Investment Score</h3>
                <Badge
                  variant="outline"
                  className={`${
                    analysis.overallScore >= 85
                      ? "bg-green-50 text-green-700"
                      : analysis.overallScore >= 70
                        ? "bg-blue-50 text-blue-700"
                        : analysis.overallScore >= 50
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-red-50 text-red-700"
                  }`}
                >
                  {analysis.overallScore}/100
                </Badge>
              </div>
              <Progress value={analysis.overallScore} className="h-2 w-full max-w-md" />
              <p className="text-sm text-muted-foreground">
                {analysis.overallScore >= 85
                  ? "Excellent investment opportunity"
                  : analysis.overallScore >= 70
                    ? "Good investment opportunity"
                    : analysis.overallScore >= 50
                      ? "Average investment opportunity"
                      : "Below average investment opportunity"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Valuation Score</h3>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{analysis.valuationScore}/100</span>
                  <Badge
                    variant="outline"
                    className={`${
                      analysis.valuationScore >= 85
                        ? "bg-green-50 text-green-700"
                        : analysis.valuationScore >= 70
                          ? "bg-blue-50 text-blue-700"
                          : "bg-red-50 text-red-700"
                    }`}
                  >
                    {analysis.valuationScore >= 85
                      ? "Undervalued"
                      : analysis.valuationScore >= 70
                        ? "Fair Value"
                        : "Overvalued"}
                  </Badge>
                </div>
                <Progress value={analysis.valuationScore} className="h-1.5" />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Rental Score</h3>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{analysis.rentalScore}/100</span>
                  <Badge
                    variant="outline"
                    className={`${
                      analysis.rentalScore >= 85
                        ? "bg-green-50 text-green-700"
                        : analysis.rentalScore >= 70
                          ? "bg-blue-50 text-blue-700"
                          : "bg-red-50 text-red-700"
                    }`}
                  >
                    {analysis.rentalScore >= 85 ? "Excellent" : analysis.rentalScore >= 70 ? "Good" : "Average"}
                  </Badge>
                </div>
                <Progress value={analysis.rentalScore} className="h-1.5" />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Cash Flow Score</h3>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{analysis.cashFlowScore}/100</span>
                  <Badge
                    variant="outline"
                    className={`${
                      analysis.cashFlowScore >= 85
                        ? "bg-green-50 text-green-700"
                        : analysis.cashFlowScore >= 70
                          ? "bg-blue-50 text-blue-700"
                          : "bg-red-50 text-red-700"
                    }`}
                  >
                    {analysis.cashFlowScore >= 85 ? "Strong" : analysis.cashFlowScore >= 70 ? "Positive" : "Limited"}
                  </Badge>
                </div>
                <Progress value={analysis.cashFlowScore} className="h-1.5" />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Appreciation Score</h3>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{analysis.appreciationScore}/100</span>
                  <Badge
                    variant="outline"
                    className={`${
                      analysis.appreciationScore >= 85
                        ? "bg-green-50 text-green-700"
                        : analysis.appreciationScore >= 70
                          ? "bg-blue-50 text-blue-700"
                          : "bg-red-50 text-red-700"
                    }`}
                  >
                    {analysis.appreciationScore >= 85 ? "High" : analysis.appreciationScore >= 70 ? "Moderate" : "Low"}
                  </Badge>
                </div>
                <Progress value={analysis.appreciationScore} className="h-1.5" />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Risk Score</h3>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{analysis.riskScore}/100</span>
                  <Badge
                    variant="outline"
                    className={`${
                      analysis.riskScore <= 50
                        ? "bg-green-50 text-green-700"
                        : analysis.riskScore <= 70
                          ? "bg-blue-50 text-blue-700"
                          : "bg-red-50 text-red-700"
                    }`}
                  >
                    {analysis.riskScore <= 50 ? "Low Risk" : analysis.riskScore <= 70 ? "Moderate Risk" : "High Risk"}
                  </Badge>
                </div>
                <Progress value={analysis.riskScore} className="h-1.5" />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Investment Score</h3>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{analysis.investmentScore}/100</span>
                  <Badge
                    variant="outline"
                    className={`${
                      analysis.investmentScore >= 85
                        ? "bg-green-50 text-green-700"
                        : analysis.investmentScore >= 70
                          ? "bg-blue-50 text-blue-700"
                          : "bg-red-50 text-red-700"
                    }`}
                  >
                    {analysis.investmentScore >= 85 ? "Excellent" : analysis.investmentScore >= 70 ? "Good" : "Average"}
                  </Badge>
                </div>
                <Progress value={analysis.investmentScore} className="h-1.5" />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="font-medium">Key Insights</h3>
              <ul className="space-y-2">
                {analysis.insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span className="text-sm">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Estimated Value</h3>
                <p className="text-lg font-semibold">${analysis.financialMetrics.estimatedValue.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Estimated Monthly Rent</h3>
                <p className="text-lg font-semibold">${analysis.financialMetrics.estimatedRent.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Cap Rate</h3>
                <p className="text-lg font-semibold">{analysis.financialMetrics.capRate.toFixed(1)}%</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Cash on Cash Return</h3>
                <p className="text-lg font-semibold">{analysis.financialMetrics.cashOnCashReturn.toFixed(1)}%</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Net Operating Income</h3>
                <p className="text-lg font-semibold">
                  ${analysis.financialMetrics.netOperatingIncome.toLocaleString()}/year
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Gross Rent Multiplier</h3>
                <p className="text-lg font-semibold">{analysis.financialMetrics.grossRentMultiplier.toFixed(1)}x</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Operating Expense Ratio</h3>
                <p className="text-lg font-semibold">
                  {(analysis.financialMetrics.operatingExpenseRatio * 100).toFixed(1)}%
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Break-Even Ratio</h3>
                <p className="text-lg font-semibold">{(analysis.financialMetrics.breakEvenRatio * 100).toFixed(1)}%</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Investment Recommendations</h3>
                <ul className="mt-2 space-y-2">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Actionable Steps</h3>
                <ol className="mt-2 space-y-2 pl-5 text-sm">
                  <li className="list-decimal">
                    {analysis.valuationScore >= 85
                      ? "Make an offer at or slightly below asking price"
                      : analysis.valuationScore >= 70
                        ? "Consider making an offer 3-5% below asking price"
                        : "Negotiate aggressively or consider alternative properties"}
                  </li>
                  <li className="list-decimal">
                    {analysis.cashFlowScore >= 80
                      ? "Secure financing with focus on maximizing cash flow (consider 30-year fixed)"
                      : "Explore creative financing options to improve cash flow (consider higher down payment)"}
                  </li>
                  <li className="list-decimal">
                    {analysis.rentalScore >= 80
                      ? "Prepare for immediate rental - property should rent quickly at market rates"
                      : "Budget for minor improvements to maximize rental potential"}
                  </li>
                  <li className="list-decimal">
                    {analysis.appreciationScore >= 80
                      ? "Plan for long-term hold (5+ years) to maximize appreciation potential"
                      : "Focus on forced appreciation through strategic improvements"}
                  </li>
                  <li className="list-decimal">
                    {analysis.riskScore <= 50
                      ? "Standard due diligence should be sufficient"
                      : "Conduct thorough due diligence with focus on risk mitigation"}
                  </li>
                </ol>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comparables" className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-medium">Comparable Properties</h3>
              <div className="space-y-3">
                {analysis.comparableProperties.map((comp, index) => (
                  <div key={index} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{comp.address}</h4>
                      <Badge variant="outline">{comp.similarity}% Similar</Badge>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium">${comp.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price/sqft:</span>
                        <span className="font-medium">${comp.pricePerSqFt}/sqft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size:</span>
                        <span className="font-medium">{comp.squareFeet.toLocaleString()} sqft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bed/Bath:</span>
                        <span className="font-medium">
                          {comp.bedrooms}bd/{comp.bathrooms}ba
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year Built:</span>
                        <span className="font-medium">{comp.yearBuilt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Distance:</span>
                        <span className="font-medium">{comp.distance} miles</span>
                      </div>
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
