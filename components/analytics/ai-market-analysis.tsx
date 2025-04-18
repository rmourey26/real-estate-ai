"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"

interface AIMarketAnalysisProps {
  initialContent: string
  title: string
  description: string
  endpoint: string
}

export function AIMarketAnalysis({ initialContent, title, description, endpoint }: AIMarketAnalysisProps) {
  const [content, setContent] = useState(initialContent)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true)
        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error(`Failed to fetch analysis: ${response.statusText}`)
        }

        const data = await response.json()
        setContent(data.analysis || data.prediction || data.content || initialContent)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching analysis:", err)
        setError("Failed to load AI-generated content. Using static content instead.")
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [endpoint, initialContent])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {error && (
          <div className="flex items-center gap-2 text-yellow-500 text-sm mt-2">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="prose max-w-none relative">
        {loading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </CardContent>
    </Card>
  )
}
