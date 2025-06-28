"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { MarketInsightsCard } from "@/components/analytics/market-insights-card"
import { OpportunityZonesCard } from "@/components/analytics/opportunity-zones-card"
import { InvestmentStrategyGenerator } from "@/components/analytics/investment-strategy-generator"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface KeyTrend \{
  trend: string
  impact: string
  confidence: number
\}

interface HotMarket \{
  location: string
  priceChange: string
  inventory: string
  outlook: string
\}

interface StructuredAnalysis \{
  summary: string
  keyTrends: KeyTrend[]
  hotMarkets: HotMarket[]
\}

const mockPriceData = [\
  \{ month: "Jan", price: 410000 \},\
  \{ month: "Feb", price: 415000 \},\
  \{ month: "Mar", price: 422000 \},\
  \{ month: "Apr", price: 428000 \},\
  \{ month: "May", price: 435000 \},\
  \{ month: "Jun", price: 430000 \},
]

const mockInventoryData = [\
  \{ month: "Jan", units: 1200 \},\
  \{ month: "Feb", units: 1250 \},\
  \{ month: "Mar", units: 1350 \},\
  \{ month: "Apr", units: 1400 \},\
  \{ month: "May", units: 1500 \},\
  \{ month: "Jun", units: 1450 \},
]

export default function AnalyticsPage()
\
{
  const [marketAnalysis, setMarketAnalysis] = useState<string | null>(null)
  const [trendPrediction, setTrendPrediction] = useState<string | null>(null)
  const [structuredAnalysis, setStructuredAnalysis] = useState<StructuredAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
\
  useEffect(() => \{
    async function fetchData() \
      try \{
        setLoading(true)
        const [marketRes, trendRes, structuredRes] = await Promise.all([
          fetch("/api/analytics/market-analysis"),
          fetch("/api/analytics/trend-prediction"),
          fetch("/api/analytics/structured-analysis"),
        ])

        if (!marketRes.ok || !trendRes.ok || !structuredRes.ok) \
          throw new Error("Failed to fetch analytics data")
        \

        const marketData = await marketRes.json()
        const trendData = await trendRes.json()
        const structuredData = await structuredRes.json()

        setMarketAnalysis(marketData.marketAnalysis)
        setTrendPrediction(trendData.trendPrediction)
        setStructuredAnalysis(structuredData.structuredAnalysis)\
      \} catch (err) \
        setError(err instanceof Error ? err.message : "An unknown error occurred")\
      \finally \
        setLoading(false)
      \
    \
    fetchData()\
  \}, [])

  const topMarkets = structuredAnalysis?.hotMarkets.map((market) => market.location).slice(0, 3) || []

  const renderError = () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>\{error\}</AlertDescription>
    </Alert>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Market Analytics</h1>
        <p className="text-muted-foreground">AI-powered insights into real estate market trends</p>
      </div>

      \{error && renderError()\}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="insights">Market Insights</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunity Zones</TabsTrigger>
          <TabsTrigger value="strategy">Investment Strategy</TabsTrigger>
          <TabsTrigger value="trends">Price Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Market Analysis</CardTitle>
              <CardDescription>AI-generated analysis of current market conditions</CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
              \{loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (\
                marketAnalysis && <div dangerouslySetInnerHTML=\{\{ __html: marketAnalysis \}\} />
              )\}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Median Home Prices</CardTitle>
                <CardDescription>National median home prices over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>\
                <ChartContainer config=\{\{\}\} className="h-[250px] w-full">\
                  <LineChart data=\{mockPriceData\} margin=\{\{ top: 5, right: 20, left: -10, bottom: 5 \}\}>
                    <XAxis dataKey="month" />\
                    <YAxis tickFormatter=\{(value) => `$$\{value / 1000\}k`\} />
                    <Tooltip\
                      content=\{<ChartTooltipContent indicator="line\" labelFormatter=\{(value) => `Month: $\{value\}`\} />\}
                    />
                    <Line type="monotone" dataKey="price" stroke="var(--color-primary)\" strokeWidth=\{2\} dot=\{false\} />
                  </LineChart>
                </ChartContainer>\
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Inventory Levels</CardTitle>
                <CardDescription>Available housing inventory over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>\
                <ChartContainer config=\{\{\}\} className="h-[250px] w-full">\
                  <BarChart data=\{mockInventoryData\} margin=\{\{ top: 5, right: 20, left: -10, bottom: 5 \}\}>
                    <XAxis dataKey="month" />\
                    <YAxis tickFormatter=\{(value) => `$\{value / 1000\}k`\} />
                    <Tooltip\
                      content=\{<ChartTooltipContent indicator="dot\" labelFormatter=\{(value) => `Month: $\{value\}`\} />\}
                    />
                    <Bar dataKey="units" fill="var(--color-primary)\" radius=\{4\} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Market Trends</CardTitle>
              <CardDescription>AI-identified trends and their impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                \{loading ? (
                  Array.from(\{ length: 3 \}).map((_, index) => (
                    <div key=\{index\} className="border-b pb-4 last:border-0">
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="mt-2 h-4 w-full" />
                    </div>
                  ))
                ) : (
                  structuredAnalysis?.keyTrends.map((trend, index) => (
                    <div key=\{index\} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">\{trend.trend\}</h3>
                        <div className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                          \{trend.confidence\}% confidence
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">\{trend.impact\}</p>
                    </div>
                  ))
                )\}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          \{loading
            ? Array.from(\{ length: 3 \}).map((_, i) => <Skeleton key=\{i\} className="h-48 w-full" />)
            : topMarkets.map((market, index) => <MarketInsightsCard key=\{index\} region=\{market\} />)\}
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          \{loading
            ? Array.from(\{ length: 3 \}).map((_, i) => <Skeleton key=\{i\} className="h-48 w-full" />)
            : topMarkets.map((market, index) => <OpportunityZonesCard key=\{index\} region=\{market\} />)\}
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <InvestmentStrategyGenerator defaultRegion=\{loading ? "" : topMarkets[0] || ""\} />
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Trends by Property Type</CardTitle>
              <CardDescription>How different property types are performing</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">Property type comparison chart will appear here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Market Predictions</CardTitle>
              <CardDescription>AI-generated predictions for future market trends</CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
              \{loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                trendPrediction && <div dangerouslySetInnerHTML=\{\{ __html: trendPrediction \}\} />
              )\}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
\}
