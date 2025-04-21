"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, BrainCircuit, CheckCircle2, AlertCircle } from "lucide-react"

interface InvestmentStrategyGeneratorProps {
  defaultRegion?: string
}

export function InvestmentStrategyGenerator({ defaultRegion = "" }: InvestmentStrategyGeneratorProps) {
  const [region, setRegion] = useState(defaultRegion)
  const [budget, setBudget] = useState("250000")
  const [investmentGoals, setInvestmentGoals] = useState("cash-flow")
  const [timeHorizon, setTimeHorizon] = useState("medium")
  const [riskTolerance, setRiskTolerance] = useState("moderate")
  const [loading, setLoading] = useState(false)
  const [strategy, setStrategy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateStrategy = async () => {
    if (!region) {
      setError("Please enter a region")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/investment/strategy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          region,
          budget: Number.parseInt(budget),
          investmentGoals: getInvestmentGoalLabel(investmentGoals),
          timeHorizon: getTimeHorizonLabel(timeHorizon),
          riskTolerance: getRiskToleranceLabel(riskTolerance),
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate strategy: ${response.statusText}`)
      }

      const data = await response.json()
      setStrategy(data.strategy)
      setLoading(false)
    } catch (err) {
      console.error("Error generating investment strategy:", err)
      setError("Failed to generate investment strategy")
      setLoading(false)
    }
  }

  const getInvestmentGoalLabel = (value: string) => {
    switch (value) {
      case "cash-flow":
        return "Maximize monthly cash flow"
      case "appreciation":
        return "Maximize long-term appreciation"
      case "balanced":
        return "Balanced approach (cash flow and appreciation)"
      case "tax-benefits":
        return "Tax benefits and wealth preservation"
      default:
        return "Balanced approach (cash flow and appreciation)"
    }
  }

  const getTimeHorizonLabel = (value: string) => {
    switch (value) {
      case "short":
        return "Short-term (1-2 years)"
      case "medium":
        return "Medium-term (3-5 years)"
      case "long":
        return "Long-term (5+ years)"
      default:
        return "Medium-term (3-5 years)"
    }
  }

  const getRiskToleranceLabel = (value: string) => {
    switch (value) {
      case "conservative":
        return "Conservative"
      case "moderate":
        return "Moderate"
      case "aggressive":
        return "Aggressive"
      default:
        return "Moderate"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Strategy Generator</CardTitle>
        <CardDescription>
          Generate a personalized real estate investment strategy based on your criteria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generator" className="space-y-4">
          <TabsList>
            <TabsTrigger value="generator">Generator</TabsTrigger>
            <TabsTrigger value="strategy" disabled={!strategy}>
              Your Strategy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="region">Region (City, State, or Zip Code)</Label>
                <Input
                  id="region"
                  placeholder="e.g., Austin, TX"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Investment Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="e.g., 250000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investmentGoals">Investment Goals</Label>
                <Select value={investmentGoals} onValueChange={setInvestmentGoals}>
                  <SelectTrigger id="investmentGoals">
                    <SelectValue placeholder="Select investment goals" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash-flow">Maximize monthly cash flow</SelectItem>
                    <SelectItem value="appreciation">Maximize long-term appreciation</SelectItem>
                    <SelectItem value="balanced">Balanced approach</SelectItem>
                    <SelectItem value="tax-benefits">Tax benefits and wealth preservation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeHorizon">Time Horizon</Label>
                <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                  <SelectTrigger id="timeHorizon">
                    <SelectValue placeholder="Select time horizon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short-term (1-2 years)</SelectItem>
                    <SelectItem value="medium">Medium-term (3-5 years)</SelectItem>
                    <SelectItem value="long">Long-term (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                <Select value={riskTolerance} onValueChange={setRiskTolerance}>
                  <SelectTrigger id="riskTolerance">
                    <SelectValue placeholder="Select risk tolerance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-4">
            {strategy && (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: strategy }} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateStrategy} disabled={loading || !region} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Strategy...
            </>
          ) : strategy ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Regenerate Strategy
            </>
          ) : (
            <>
              <BrainCircuit className="mr-2 h-4 w-4" /> Generate Investment Strategy
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
