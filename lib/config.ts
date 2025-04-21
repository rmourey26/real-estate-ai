// Environment configuration
export const config = {
  // Supabase configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // Remove direct reference to the anon key
  },

  // API configuration
  api: {
    useRealApis: process.env.USE_REAL_APIS === "true",
    zillowApiKey: process.env.ZILLOW_API_KEY || "",
    redfinApiKey: process.env.REDFIN_API_KEY || "",
    mlsApiKey: process.env.MLS_API_KEY || "",
    repliersApiKey: process.env.REPLIERS_API_KEY || "",
    repliersRegion: process.env.REPLIERS_REGION || "us",
  },

  // Application configuration
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    environment: process.env.NODE_ENV || "development",
    isProduction: process.env.NODE_ENV === "production",
  },

  // AI configuration
  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",
  },
}
