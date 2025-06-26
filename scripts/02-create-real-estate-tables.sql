-- Update real estate listings table
DROP TABLE IF EXISTS public.real_estate_listings CASCADE;
CREATE TABLE public.real_estate_listings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    bedrooms INTEGER,
    bathrooms DECIMAL(3,1),
    square_feet INTEGER,
    lot_size DECIMAL(10,2),
    year_built INTEGER,
    property_type TEXT NOT NULL,
    listing_status TEXT DEFAULT 'active' CHECK (listing_status IN ('active', 'pending', 'sold', 'off_market')),
    deal_score DECIMAL(3,1) DEFAULT 0,
    deal_reasons TEXT[],
    listing_url TEXT,
    image_url TEXT,
    images TEXT[],
    description TEXT,
    features TEXT[],
    neighborhood TEXT,
    school_district TEXT,
    hoa_fee DECIMAL(8,2),
    property_taxes DECIMAL(10,2),
    days_on_market INTEGER DEFAULT 0,
    price_per_sqft DECIMAL(8,2) GENERATED ALWAYS AS (
        CASE WHEN square_feet > 0 THEN price / square_feet ELSE NULL END
    ) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create market trends table
CREATE TABLE IF NOT EXISTS public.market_trends (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    region TEXT NOT NULL,
    region_type TEXT DEFAULT 'city' CHECK (region_type IN ('city', 'zip', 'state', 'neighborhood')),
    median_price DECIMAL(12,2) NOT NULL,
    price_change_pct DECIMAL(5,2),
    avg_days_on_market INTEGER,
    inventory_count INTEGER,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(region, region_type, month, year)
);

-- Create user saved listings table
CREATE TABLE IF NOT EXISTS public.user_saved_listings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    listing_id UUID REFERENCES public.real_estate_listings(id) ON DELETE CASCADE NOT NULL,
    notes TEXT,
    tags TEXT[],
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
);

-- Create property analysis table
CREATE TABLE IF NOT EXISTS public.property_analysis (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    listing_id UUID REFERENCES public.real_estate_listings(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    analysis_type TEXT NOT NULL CHECK (analysis_type IN ('investment', 'cma', 'rental', 'flip')),
    analysis_data JSONB NOT NULL,
    confidence_score DECIMAL(3,1),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create search history table
CREATE TABLE IF NOT EXISTS public.search_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    search_query TEXT NOT NULL,
    filters JSONB,
    results_count INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_listings_city_state ON public.real_estate_listings(city, state);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.real_estate_listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.real_estate_listings(listing_status);
CREATE INDEX IF NOT EXISTS idx_listings_property_type ON public.real_estate_listings(property_type);
CREATE INDEX IF NOT EXISTS idx_market_trends_region ON public.market_trends(region, region_type);
CREATE INDEX IF NOT EXISTS idx_saved_listings_user ON public.user_saved_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_property_analysis_listing ON public.property_analysis(listing_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user ON public.search_history(user_id);

-- Enable RLS
ALTER TABLE public.real_estate_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view active listings" ON public.real_estate_listings
    FOR SELECT USING (listing_status = 'active');

CREATE POLICY "Anyone can view market trends" ON public.market_trends
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own saved listings" ON public.user_saved_listings
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own property analysis" ON public.property_analysis
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own search history" ON public.search_history
    FOR ALL USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_real_estate_listings_updated_at
    BEFORE UPDATE ON public.real_estate_listings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_market_trends_updated_at
    BEFORE UPDATE ON public.market_trends
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_saved_listings_updated_at
    BEFORE UPDATE ON public.user_saved_listings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_property_analysis_updated_at
    BEFORE UPDATE ON public.property_analysis
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
