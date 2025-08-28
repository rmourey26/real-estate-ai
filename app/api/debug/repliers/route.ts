import { type NextRequest, NextResponse } from "next/server"
import { repliersClient } from "@/lib/api/real-estate/clients/repliers"

export async function GET(request: NextRequest) {
  try {
    const result = await repliersClient.testConnection()

    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString(),
      environment: {
        hasApiKey: !!process.env.REPLIERS_API_KEY,
        apiKeyLength: process.env.REPLIERS_API_KEY?.length || 0,
        region: process.env.REPLIERS_REGION || "us",
        useRealApis: process.env.USE_REAL_APIS === "true",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Debug endpoint error: ${error instanceof Error ? error.message : "Unknown error"}`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
