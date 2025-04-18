// Environment configuration with safe access to environment variables
export const config = {
  // Supabase configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
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

  // AI configuration - using a safer approach
  ai: {
    // Safe getter for OpenAI API key
    get openaiApiKey() {
      return typeof process !== "undefined" && process.env ? process.env.OPENAI_API_KEY || "" : ""
    },
    // Safe getter for Anthropic API key
    get anthropicApiKey() {
      return typeof process !== "undefined" && process.env ? process.env.ANTHROPIC_API_KEY || "" : ""
    },
    // Safe getter for Mistral API key
    get mistralApiKey() {
      return typeof process !== "undefined" && process.env ? process.env.MISTRAL_API_KEY || "" : ""
    },
    // Helper function to check if any AI providers are configured
    get hasAnyAiProvider() {
      if (typeof process === "undefined" || !process.env) return false
      return !!(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.MISTRAL_API_KEY)
    },
  },
}
