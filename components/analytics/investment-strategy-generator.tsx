"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function InvestmentStrategyGenerator() {
  const [region, setRegion] = useState("")
  const [budget, setBudget] = useState("250000")
  const [investmentGoals, setInvestmentGoals] = useState("Balanced approach (cash flow and appreciation)")
  const [timeHorizon, setTimeHorizon] = useState("Medium-term (3-5 years)")
  const [riskTolerance, setRiskTolerance] = useState("Moderate")
  const [strategy, setStrategy] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setStrategy("")

    try {
      const response = await fetch("/api/investment/strategy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          region,
          budget: Number.parseInt(budget),
          investmentGoals,
          timeHorizon,
          riskTolerance,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate investment strategy")
      }

      setStrategy(data.strategy)

      // Show notice if using fallback strategy
      if (data.notice) {
        toast({
          title: "AI Service Unavailable",
          description: "Using fallback strategy generator. Some features may be limited.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error generating investment strategy:", err)
      setError("Failed to generate investment strategy. Please try again later.")
      toast({
        title: "Error",
        description: "Failed to generate investment strategy. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Investment Strategy Generator</CardTitle>
        <CardDescription>
          Generate a personalized real estate investment strategy based on your preferences and goals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              placeholder="Enter city, state, or zip code"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Budget</Label>
            <Input
              id="budget"
              type="number"
              min="50000"
              step="10000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="investmentGoals">Investment Goals</Label>
            <Select value={investmentGoals} onValueChange={setInvestmentGoals}>
              <SelectTrigger>
                <SelectValue placeholder="Select investment goals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash flow focused">Cash flow focused</SelectItem>
                <SelectItem value="Appreciation focused">Appreciation focused</SelectItem>
                <SelectItem value="Balanced approach (cash flow and appreciation)">
                  Balanced approach (cash flow and appreciation)
                </SelectItem>
                <SelectItem value="Tax benefits">Tax benefits</SelectItem>
                <SelectItem value="Portfolio diversification">Portfolio diversification</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeHorizon">Time Horizon</Label>
            <Select value={timeHorizon} onValueChange={setTimeHorizon}>
              <SelectTrigger>
                <SelectValue placeholder="Select time horizon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Short-term (1-2 years)">Short-term (1-2 years)</SelectItem>
                <SelectItem value="Medium-term (3-5 years)">Medium-term (3-5 years)</SelectItem>
                <SelectItem value="Long-term (5+ years)">Long-term (5+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="riskTolerance">Risk Tolerance</Label>
            <Select value={riskTolerance} onValueChange={setRiskTolerance}>
              <SelectTrigger>
                <SelectValue placeholder="Select risk tolerance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Conservative">Conservative</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Aggressive">Aggressive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Strategy...
              </>
            ) : (
              "Generate Investment Strategy"
            )}
          </Button>
        </form>

        {error && <div className="mt-4 text-red-500">{error}</div>}

        {strategy && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Your Investment Strategy</h3>
            <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">{strategy}</div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        This strategy is generated based on current market data and AI analysis. Always consult with a financial advisor
        before making investment decisions.
      </CardFooter>
    </Card>
  )
}
