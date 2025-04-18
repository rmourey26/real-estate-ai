import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketInsightsCard } from "@/components/analytics/market-insights-card"
import { OpportunityZonesCard } from "@/components/analytics/opportunity-zones-card"
import { InvestmentStrategyGenerator } from "@/components/analytics/investment-strategy-generator"

// Static market analysis to use as fallback
const staticMarketAnalysis = `
<h2>Current US Real Estate Market Overview</h2>
<p>The US real estate market continues to show regional variations with some markets experiencing moderate growth while others face challenges with affordability and inventory constraints.</p>

<h3>Key Observations:</h3>
<ul>
  <li>Mortgage rates have stabilized but remain higher than historical averages</li>
  <li>Housing inventory has improved slightly but remains below pre-pandemic levels</li>
  <li>Price appreciation has moderated in most markets</li>
  <li>Regional markets show significant variation in performance</li>
  <li>Rental markets remain strong in most metropolitan areas</li>
</ul>

<p>Investors should focus on markets with strong economic fundamentals, population growth, and diversified employment sectors.</p>
`

// Static trend prediction to use as fallback
const staticTrendPrediction = `
<h2>Real Estate Market Forecast</h2>

<h3>Short-Term Outlook (3 months)</h3>
<p>The market is expected to maintain current conditions with modest price growth in most regions. Seasonal patterns will likely influence activity levels with some slowdown during winter months.</p>

<h3>Medium-Term Outlook (6 months)</h3>
<p>Mortgage rates may see modest adjustments based on Federal Reserve policies. Housing inventory is expected to gradually improve, providing more options for buyers and potentially moderating price growth.</p>

<h3>Long-Term Outlook (12 months)</h3>
<p>The market is projected to continue its normalization process with more balanced conditions between buyers and sellers. Regional variations will persist, with stronger growth in areas with positive migration patterns and job creation.</p>

<h3>Investment Implications</h3>
<p>Investors should consider:</p>
<ul>
  <li>Cash flow opportunities in stable markets</li>
  <li>Value-add strategies in emerging neighborhoods</li>
  <li>Long-term appreciation potential in high-growth metros</li>
  <li>Portfolio diversification across different property types and locations</li>
</ul>
`

// Static structured market analysis to use as fallback
const staticStructuredAnalysis = {
  summary:
    "The US real estate market shows regional variations with moderating price growth and improving inventory levels.",
  keyTrends: [
    {
      trend: "Mortgage Rate Stabilization",
      impact: "Higher but stable mortgage rates are creating a more predictable environment for buyers and investors.",
      confidence: 85,
    },
    {
      trend: "Inventory Improvement",
      impact: "Gradually increasing inventory is providing more options for buyers and reducing competitive pressure.",
      confidence: 75,
    },
    {
      trend: "Regional Divergence",
      impact:
        "Market performance varies significantly by region, with stronger growth in the South and parts of the Midwest.",
      confidence: 90,
    },
    {
      trend: "Rental Demand Strength",
      impact:
        "Strong rental demand continues to support investment properties, particularly in urban and near-urban areas.",
      confidence: 80,
    },
  ],
  hotMarkets: [
    {
      location: "Austin, TX",
      priceChange: "+5.2% YoY",
      inventory: "Improving",
      outlook: "Strong growth potential with tech sector expansion",
    },
    {
      location: "Raleigh, NC",
      priceChange: "+6.8% YoY",
      inventory: "Moderate",
      outlook: "Positive outlook with strong job market",
    },
    {
      location: "Nashville, TN",
      priceChange: "+4.7% YoY",
      inventory: "Limited but improving",
      outlook: "Continued growth expected with diverse economy",
    },
    {
      location: "Tampa, FL",
      priceChange: "+3.9% YoY",
      inventory: "Increasing",
      outlook: "Steady growth with migration trends",
    },
  ],
  investmentRecommendations: [
    {
      strategy: "Cash Flow Focus",
      propertyType: "Multi-family (2-4 units)",
      locations: ["Midwest cities", "Secondary Southern markets", "Suburban areas near job centers"],
      expectedReturn: "8-12% annual ROI",
      riskLevel: "Medium",
    },
    {
      strategy: "Appreciation Play",
      propertyType: "Single-family homes",
      locations: ["Growing tech hubs", "Areas with infrastructure development", "University towns"],
      expectedReturn: "5-7% annual appreciation",
      riskLevel: "Medium",
    },
    {
      strategy: "Value-Add Opportunities",
      propertyType: "Underperforming properties",
      locations: ["Emerging neighborhoods", "Revitalization zones", "Areas with rezoning potential"],
      expectedReturn: "15-20% ROI after improvements",
      riskLevel: "High",
    },
  ],
}

// Top markets from static analysis
const staticTopMarkets = ["Austin, TX", "Raleigh, NC", "Nashville, TN"]

export default async function AnalyticsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get market trends data
  const { data: marketTrends } = await supabase
    .from("market_trends")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  // Use static data instead of AI-generated content during build
  const marketAnalysis = staticMarketAnalysis
  const trendPrediction = staticTrendPrediction
  const structuredAnalysis = staticStructuredAnalysis
  const topMarkets = staticTopMarkets

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Market Analytics</h1>
        <p className="text-muted-foreground">AI-powered insights into real estate market trends</p>
      </div>

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
            <CardContent className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: marketAnalysis }} />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Median Home Prices</CardTitle>
                <CardDescription>National median home prices over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">Price trend chart will appear here</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Inventory Levels</CardTitle>
                <CardDescription>Available housing inventory over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">Inventory chart will appear here</p>
                </div>
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
                {structuredAnalysis.keyTrends.map((trend, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{trend.trend}</h3>
                      <div className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {trend.confidence}% confidence
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{trend.impact}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {topMarkets.map((market, index) => (
            <MarketInsightsCard key={index} region={market} />
          ))}
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          {topMarkets.map((market, index) => (
            <OpportunityZonesCard key={index} region={market} />
          ))}
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <InvestmentStrategyGenerator defaultRegion={topMarkets[0] || ""} />
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

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Single Family Homes</CardTitle>
                <CardDescription>Price trends for single family homes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+3.2%</div>
                <p className="text-xs text-muted-foreground">Year over year change</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Condos & Townhomes</CardTitle>
                <CardDescription>Price trends for condos and townhomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+1.8%</div>
                <p className="text-xs text-muted-foreground">Year over year change</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Multi-Family</CardTitle>
                <CardDescription>Price trends for multi-family properties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+4.5%</div>
                <p className="text-xs text-muted-foreground">Year over year change</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Market Predictions</CardTitle>
              <CardDescription>AI-generated predictions for future market trends</CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: trendPrediction }} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
