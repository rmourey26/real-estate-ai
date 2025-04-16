import { createClient } from "@supabase/supabase-js"
import { config } from "../lib/config"

// Initialize Supabase client
const supabase = createClient(config.supabase.url, config.supabase.anonKey)

// Generate random properties
async function generateProperties(count: number) {
  const cities = [
    { city: "Austin", state: "TX" },
    { city: "Denver", state: "CO" },
    { city: "Seattle", state: "WA" },
    { city: "Nashville", state: "TN" },
    { city: "Charlotte", state: "NC" },
    { city: "Phoenix", state: "AZ" },
    { city: "Atlanta", state: "GA" },
    { city: "Dallas", state: "TX" },
    { city: "Portland", state: "OR" },
    { city: "Raleigh", state: "NC" },
  ]

  const propertyTypes = ["residential", "multi-family", "commercial", "condo"]
  const listingStatuses = ["active", "pending", "sold"]

  const properties = []

  for (let i = 0; i < count; i++) {
    const cityInfo = cities[Math.floor(Math.random() * cities.length)]
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)]
    const listingStatus = listingStatuses[Math.floor(Math.random() * listingStatuses.length)]

    // Generate random price between $200k and $1.5M
    const price = Math.floor(Math.random() * (1500000 - 200000) + 200000)

    // Generate random square footage between 800 and 4000
    const squareFeet = Math.floor(Math.random() * (4000 - 800) + 800)

    // Generate random bedrooms between 1 and 5
    const bedrooms = Math.floor(Math.random() * 5) + 1

    // Generate random bathrooms between 1 and 4
    const bathrooms = Math.floor(Math.random() * 4) + 1

    // Generate random year built between 1950 and 2023
    const yearBuilt = Math.floor(Math.random() * (2023 - 1950) + 1950)

    // Generate random deal score between 0 and 20
    const dealScore = Math.floor(Math.random() * 20)

    // Generate random deal reasons
    const dealReasons = []
    if (dealScore > 5) {
      dealReasons.push("Priced below comparable properties in the area")
    }
    if (dealScore > 10) {
      dealReasons.push("Recently renovated with high-end finishes")
    }
    if (dealScore > 15) {
      dealReasons.push("Located in a rapidly appreciating neighborhood")
    }

    properties.push({
      address: `${Math.floor(Math.random() * 9999) + 1} ${["Main", "Oak", "Maple", "Pine", "Cedar"][Math.floor(Math.random() * 5)]} ${["St", "Ave", "Blvd", "Dr", "Ln"][Math.floor(Math.random() * 5)]}`,
      city: cityInfo.city,
      state: cityInfo.state,
      zip_code: String(Math.floor(Math.random() * 90000) + 10000),
      price,
      bedrooms,
      bathrooms,
      square_feet: squareFeet,
      year_built: yearBuilt,
      property_type: propertyType,
      listing_status: listingStatus,
      deal_score: dealScore,
      deal_reasons: dealReasons,
      image_url: `/placeholder.svg?height=400&width=600&text=Property+${i + 1}`,
    })
  }

  // Insert properties into the database
  const { data, error } = await supabase.from("real_estate_listings").insert(properties)

  if (error) {
    console.error("Error inserting properties:", error)
  } else {
    console.log(`Successfully inserted ${count} properties`)
  }
}

// Generate market trends
async function generateMarketTrends(count: number) {
  const regions = [
    { region: "Austin", type: "city" },
    { region: "Denver", type: "city" },
    { region: "Seattle", type: "city" },
    { region: "Nashville", type: "city" },
    { region: "Charlotte", type: "city" },
    { region: "78701", type: "zip" },
    { region: "80202", type: "zip" },
    { region: "98101", type: "zip" },
    { region: "Texas", type: "state" },
    { region: "Colorado", type: "state" },
  ]

  const trends = []

  for (let i = 0; i < count; i++) {
    const regionInfo = regions[Math.floor(Math.random() * regions.length)]

    // Generate random month between 1 and 12
    const month = Math.floor(Math.random() * 12) + 1

    // Generate random year between 2020 and 2025
    const year = Math.floor(Math.random() * 6) + 2020

    // Generate random median price between $200k and $800k
    const medianPrice = Math.floor(Math.random() * (800000 - 200000) + 200000)

    // Generate random price change percentage between -5% and 15%
    const priceChangePct = Math.floor(Math.random() * 20) - 5

    // Generate random average days on market between 10 and 60
    const avgDaysOnMarket = Math.floor(Math.random() * 50) + 10

    // Generate random inventory count between 50 and 500
    const inventoryCount = Math.floor(Math.random() * 450) + 50

    trends.push({
      region: regionInfo.region,
      region_type: regionInfo.type,
      median_price: medianPrice,
      price_change_pct: priceChangePct,
      avg_days_on_market: avgDaysOnMarket,
      inventory_count: inventoryCount,
      month,
      year,
    })
  }

  // Insert trends into the database
  const { data, error } = await supabase.from("market_trends").insert(trends)

  if (error) {
    console.error("Error inserting market trends:", error)
  } else {
    console.log(`Successfully inserted ${count} market trends`)
  }
}

// Run the data generation
async function generateData() {
  console.log("Generating sample data...")

  await generateProperties(50)
  await generateMarketTrends(30)

  console.log("Sample data generation complete!")
}

generateData()
