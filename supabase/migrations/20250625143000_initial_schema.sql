-- Supabase Migration: Initial Schema Setup
-- Version: 20250625143000

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create profiles table (replaces user_profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT GENERATED ALWAYS AS (TRIM(BOTH FROM COALESCE(first_name, '') || ' ' || COALESCE(last_name, ''))) STORED,
    phone TEXT,
    company TEXT,
    bio TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC' NOT NULL,
    language TEXT DEFAULT 'en' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.profiles IS 'User profile information, linked to auth.users.';
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create notification settings table
CREATE TABLE IF NOT EXISTS public.notification_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email_notifications BOOLEAN DEFAULT true NOT NULL,
    push_notifications BOOLEAN DEFAULT true NOT NULL,
    marketing_emails BOOLEAN DEFAULT false NOT NULL,
    deal_alerts BOOLEAN DEFAULT true NOT NULL,
    price_drop_alerts BOOLEAN DEFAULT true NOT NULL,
    new_listing_alerts BOOLEAN DEFAULT true NOT NULL,
    weekly_reports BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.notification_settings IS 'User preferences for notifications.';
CREATE TRIGGER update_notification_settings_updated_at
    BEFORE UPDATE ON public.notification_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create privacy settings table
CREATE TABLE IF NOT EXISTS public.privacy_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    profile_visibility TEXT DEFAULT 'private' NOT NULL CHECK (profile_visibility IN ('public', 'private')),
    show_email BOOLEAN DEFAULT false NOT NULL,
    show_phone BOOLEAN DEFAULT false NOT NULL,
    data_sharing BOOLEAN DEFAULT false NOT NULL,
    analytics_tracking BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.privacy_settings IS 'User privacy preferences.';
CREATE TRIGGER update_privacy_settings_updated_at
    BEFORE UPDATE ON public.privacy_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    features JSONB DEFAULT '[]'::jsonb NOT NULL,
    limits JSONB DEFAULT '{}'::jsonb NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    stripe_product_id TEXT,
    stripe_monthly_price_id TEXT,
    stripe_yearly_price_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.subscription_plans IS 'Available subscription plans for users.';
CREATE TRIGGER update_subscription_plans_updated_at
    BEFORE UPDATE ON public.subscription_plans
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE, -- Assuming one active subscription per user
    plan_id UUID REFERENCES public.subscription_plans(id) NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'inactive', 'cancelled', 'past_due', 'trialing')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false NOT NULL,
    cancelled_at TIMESTAMPTZ,
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.user_subscriptions IS 'Tracks user subscriptions to plans.';
CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create billing history table
CREATE TABLE IF NOT EXISTS public.billing_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE SET NULL,
    plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    stripe_invoice_id TEXT UNIQUE,
    invoice_url TEXT,
    billing_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.billing_history IS 'Records of user billing events.';

-- Create real estate listings table
CREATE TABLE IF NOT EXISTS public.real_estate_listings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    price DECIMAL(12,2) NOT NULL,
    bedrooms INTEGER,
    bathrooms DECIMAL(3,1),
    square_feet INTEGER,
    lot_size_acres DECIMAL(10,2),
    year_built INTEGER,
    property_type TEXT NOT NULL,
    listing_status TEXT DEFAULT 'active' NOT NULL CHECK (listing_status IN ('active', 'pending', 'sold', 'off_market', 'coming_soon')),
    deal_score DECIMAL(3,1) DEFAULT 0.0,
    deal_reasons TEXT[],
    listing_url TEXT,
    mls_id TEXT UNIQUE,
    provider_id TEXT, -- ID from external provider like Zillow, Redfin
    image_url TEXT, -- Primary image
    images TEXT[], -- Array of image URLs
    description TEXT,
    features TEXT[],
    neighborhood TEXT,
    school_district TEXT,
    hoa_fee DECIMAL(8,2),
    property_taxes DECIMAL(10,2),
    days_on_market INTEGER DEFAULT 0,
    price_per_sqft DECIMAL(10,2) GENERATED ALWAYS AS (
        CASE WHEN square_feet IS NOT NULL AND square_feet > 0 THEN price / square_feet ELSE NULL END
    ) STORED,
    last_fetched_at TIMESTAMPTZ, -- When data was last synced from provider
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.real_estate_listings IS 'Details of real estate properties.';
CREATE TRIGGER update_real_estate_listings_updated_at
    BEFORE UPDATE ON public.real_estate_listings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create market trends table
CREATE TABLE IF NOT EXISTS public.market_trends (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    region TEXT NOT NULL,
    region_type TEXT DEFAULT 'city' NOT NULL CHECK (region_type IN ('city', 'zip', 'state', 'county', 'neighborhood')),
    metric_name TEXT NOT NULL, -- e.g., 'median_price', 'avg_dom', 'inventory_count'
    metric_value DECIMAL(15,2) NOT NULL,
    period_start_date DATE NOT NULL,
    period_end_date DATE NOT NULL,
    source TEXT, -- e.g., 'MLS', 'Zillow API'
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(region, region_type, metric_name, period_end_date)
);
COMMENT ON TABLE public.market_trends IS 'Aggregated market data for various regions.';
CREATE TRIGGER update_market_trends_updated_at
    BEFORE UPDATE ON public.market_trends
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create user saved listings table
CREATE TABLE IF NOT EXISTS public.user_saved_listings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    listing_id UUID REFERENCES public.real_estate_listings(id) ON DELETE CASCADE NOT NULL,
    notes TEXT,
    tags TEXT[],
    is_favorite BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, listing_id)
);
COMMENT ON TABLE public.user_saved_listings IS 'Listings saved by users.';
CREATE TRIGGER update_user_saved_listings_updated_at
    BEFORE UPDATE ON public.user_saved_listings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create property analysis table
CREATE TABLE IF NOT EXISTS public.property_analysis (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    listing_id UUID REFERENCES public.real_estate_listings(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- Can be null if system-generated
    analysis_type TEXT NOT NULL CHECK (analysis_type IN ('investment_roi', 'comparative_market_analysis', 'rental_yield', 'flip_potential', 'deal_score_breakdown')),
    analysis_data JSONB NOT NULL,
    summary TEXT,
    confidence_score DECIMAL(3,1),
    generated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.property_analysis IS 'AI-generated or user-requested analysis of properties.';
CREATE TRIGGER update_property_analysis_updated_at
    BEFORE UPDATE ON public.property_analysis
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create search history table
CREATE TABLE IF NOT EXISTS public.search_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    search_query TEXT,
    filters JSONB,
    results_count INTEGER,
    search_type TEXT DEFAULT 'listing' NOT NULL CHECK (search_type IN ('listing', 'market_data')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.search_history IS 'User search queries and filters.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_notification_settings_user_id ON public.notification_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_privacy_settings_user_id ON public.privacy_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_id ON public.user_subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_user_id ON public.billing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_location ON public.real_estate_listings(city, state, zip_code);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.real_estate_listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_status_type ON public.real_estate_listings(listing_status, property_type);
CREATE INDEX IF NOT EXISTS idx_market_trends_region_metric_period ON public.market_trends(region, region_type, metric_name, period_end_date);
CREATE INDEX IF NOT EXISTS idx_saved_listings_user_listing ON public.user_saved_listings(user_id, listing_id);
CREATE INDEX IF NOT EXISTS idx_property_analysis_listing_user ON public.property_analysis(listing_id, user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON public.search_history(user_id);

-- Function to handle new user creation and populate profiles table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    )
    ON CONFLICT (id) DO NOTHING; -- In case trigger runs multiple times or profile already exists

    -- Optionally, create default notification and privacy settings
    INSERT INTO public.notification_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO public.privacy_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security (RLS)
-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
-- Public profiles can be viewed if profile_visibility is public (example, adjust as needed)
-- CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (EXISTS (SELECT 1 FROM public.privacy_settings ps WHERE ps.user_id = public.profiles.id AND ps.profile_visibility = 'public'));

-- Notification Settings
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notification settings" ON public.notification_settings FOR ALL USING (auth.uid() = user_id);

-- Privacy Settings
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own privacy settings" ON public.privacy_settings FOR ALL USING (auth.uid() = user_id);

-- Subscription Plans (generally public to view)
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view active subscription plans" ON public.subscription_plans FOR SELECT TO authenticated USING (is_active = true);
-- Admins can manage plans (example, requires admin role setup)
-- CREATE POLICY "Admins can manage subscription plans" ON public.subscription_plans FOR ALL USING (is_admin_role(auth.uid())); 

-- User Subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own subscription" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
-- Potentially allow service roles or admins to manage
-- CREATE POLICY "Admins can manage user subscriptions" ON public.user_subscriptions FOR ALL USING (is_admin_role(auth.uid()));

-- Billing History
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own billing history" ON public.billing_history FOR SELECT USING (auth.uid() = user_id);

-- Real Estate Listings (publicly viewable for active ones)
ALTER TABLE public.real_estate_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active listings are viewable by everyone" ON public.real_estate_listings FOR SELECT USING (listing_status = 'active');
-- Authenticated users can see coming_soon or pending (example)
-- CREATE POLICY "Authenticated users can see more listings" ON public.real_estate_listings FOR SELECT TO authenticated USING (listing_status IN ('active', 'pending', 'coming_soon'));
-- Admins/editors can manage all listings
-- CREATE POLICY "Admins can manage all listings" ON public.real_estate_listings FOR ALL USING (is_editor_role(auth.uid()));

-- Market Trends (generally public)
ALTER TABLE public.market_trends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Market trends are viewable by everyone" ON public.market_trends FOR SELECT USING (true);

-- User Saved Listings
ALTER TABLE public.user_saved_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own saved listings" ON public.user_saved_listings FOR ALL USING (auth.uid() = user_id);

-- Property Analysis
ALTER TABLE public.property_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own property analysis" ON public.property_analysis FOR SELECT USING (auth.uid() = user_id);
-- Allow viewing if user_id is NULL (system generated and public)
CREATE POLICY "Public property analysis is viewable" ON public.property_analysis FOR SELECT USING (user_id IS NULL);

-- Search History
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own search history" ON public.search_history FOR ALL USING (auth.uid() = user_id);

COMMENT ON MIGRATION IS 'Initial schema setup for all core application tables, including profiles, settings, subscriptions, listings, and market data. Implements RLS and helper functions.';
