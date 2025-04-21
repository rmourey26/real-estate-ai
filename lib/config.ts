// Environment configuration for APIs and services
export const config = {
  // Real Estate APIs
  zillow: {
    apiKey: process.env.ZILLOW_API_KEY || "",
    baseUrl: "https://api.bridgedataoutput.com/api/v2/zestimates",
  },
  redfin: {
    apiKey: process.env.REDFIN_API_KEY || "",
    baseUrl: "https://api.redfin.com/v1",
  },
  mls: {
    apiKey: process.env.MLS_API_KEY || "",
    baseUrl: "https://api.mlsgrid.com/v2",
  },
  repliers: {
    apiKey: process.env.REPLIERS_API_KEY || "",
    baseUrl: "https://api.repliers.io/v1",
    region: process.env.REPLIERS_REGION || "us",
  },

  // AI Services
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    model: "gpt-4o",
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || "",
    model: "claude-3-opus-20240229",
  },
  mistral: {
    apiKey: process.env.MISTRAL_API_KEY || "",
    model: "mistral-large-latest",
  },

  // Geocoding and Maps
  google: {
    apiKey: process.env.GOOGLE_API_KEY || "",
  },

  // Database
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  },

  // Feature flags
  features: {
    useRealApis: process.env.USE_REAL_APIS === "true",
    enableCaching: true,
    logApiCalls: true,
  },
}
