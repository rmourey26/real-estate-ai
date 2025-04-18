"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DealAnalysis() {
  const [analysis, setAnalysis] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/deals/analysis")

        if (!response.ok) {
          throw new Error("Failed to fetch deal analysis")
        }

        const data = await response.json()
        setAnalysis(data.analysis)
      } catch (err) {
        console.error("Error fetching deal analysis:", err)
        setError("Unable to load AI analysis. Please try again later.")
        // Fallback content
        setAnalysis(
          "<p>Our analysis indicates that the current top deals represent excellent investment opportunities due to their below-market pricing, strong rental potential, and location in high-growth areas.</p><p>Properties with high deal scores typically show a combination of favorable price-to-rent ratios, below-market acquisition costs, and strong appreciation potential based on local market trends.</p>",
        )
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [])

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">AI Deal Analysis</h2>
      </CardHeader>
      <CardContent className="prose max-w-none">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-[90%]" />
          </div>
        ) : error ? (
          <div className="text-muted-foreground">{error}</div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: analysis }} />
        )}
      </CardContent>
    </Card>
  )
}
