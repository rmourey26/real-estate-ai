-- Insert subscription plans
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, features, limits) VALUES
('Starter', 'Perfect for individual investors getting started', 29.00, 290.00, 
 '["Property search", "Basic analytics", "5 saved searches", "Email alerts"]',
 '{"saved_searches": 5, "property_alerts": 10, "api_calls": 1000}'
),
('Professional', 'Advanced tools for serious real estate professionals', 79.00, 790.00,
 '["Everything in Starter", "Advanced analytics", "Unlimited saved searches", "CMA reports", "Investment calculator", "Market insights"]',
 '{"saved_searches": -1, "property_alerts": 100, "api_calls": 10000}'
),
('Enterprise', 'Complete solution for teams and large organizations', 199.00, 1990.00,
 '["Everything in Professional", "Team collaboration", "Custom reports", "API access", "Priority support", "White-label options"]',
 '{"saved_searches": -1, "property_alerts": -1, "api_calls": 100000}'
);

-- Insert sample market trends data
INSERT INTO public.market_trends (region, region_type, median_price, price_change_pct, avg_days_on_market, inventory_count, month, year) VALUES
('Austin', 'city', 450000, 5.2, 25, 1250, 12, 2024),
('Dallas', 'city', 380000, 3.8, 30, 2100, 12, 2024),
('Houston', 'city', 320000, 2.1, 35, 3200, 12, 2024),
('San Antonio', 'city', 280000, 4.5, 28, 1800, 12, 2024),
('78701', 'zip', 650000, 8.1, 20, 45, 12, 2024),
('75201', 'zip', 520000, 6.3, 22, 78, 12, 2024);

-- Insert sample real estate listings
INSERT INTO public.real_estate_listings (
    address, city, state, zip_code, price, bedrooms, bathrooms, square_feet, 
    year_built, property_type, listing_status, deal_score, deal_reasons,
    description, features, neighborhood
) VALUES
('123 Oak Street', 'Austin', 'TX', '78701', 525000, 3, 2.5, 1850, 2015, 'Single Family', 'active', 8.5, 
 ARRAY['Below market price', 'Great neighborhood', 'Recent renovations'],
 'Beautiful modern home in the heart of Austin with updated kitchen and bathrooms.',
 ARRAY['Updated kitchen', 'Hardwood floors', 'Large backyard', 'Two-car garage'],
 'Downtown Austin'
),
('456 Pine Avenue', 'Dallas', 'TX', '75201', 425000, 4, 3.0, 2200, 2010, 'Single Family', 'active', 7.2,
 ARRAY['Good investment potential', 'Growing area'],
 'Spacious family home with open floor plan and modern amenities.',
 ARRAY['Open floor plan', 'Master suite', 'Swimming pool', 'Three-car garage'],
 'Uptown Dallas'
),
('789 Maple Drive', 'Houston', 'TX', '77001', 350000, 3, 2.0, 1650, 2018, 'Townhouse', 'active', 6.8,
 ARRAY['New construction', 'Low maintenance'],
 'Modern townhouse in desirable Houston neighborhood.',
 ARRAY['New construction', 'Low maintenance', 'Community amenities'],
 'Museum District'
);
