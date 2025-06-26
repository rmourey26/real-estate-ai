-- Insert subscription plans
INSERT INTO subscription_plans (id, name, description, price, interval, features, max_properties, max_searches, ai_analysis_included, priority)
VALUES 
  (
    'starter',
    'Starter',
    'Perfect for getting started with real estate investing',
    29.00,
    'month',
    '["Up to 10 property searches per month", "Basic market insights", "Email support", "Property alerts"]'::jsonb,
    10,
    50,
    false,
    1
  ),
  (
    'professional',
    'Professional',
    'For serious investors and real estate professionals',
    79.00,
    'month',
    '["Unlimited property searches", "Advanced AI market analysis", "Priority support", "Custom property alerts", "Investment calculator", "Neighborhood analysis"]'::jsonb,
    100,
    -1,
    true,
    2
  ),
  (
    'enterprise',
    'Enterprise',
    'For teams and large-scale operations',
    199.00,
    'month',
    '["Everything in Professional", "Team collaboration tools", "API access", "Custom integrations", "Dedicated account manager", "White-label options"]'::jsonb,
    -1,
    -1,
    true,
    3
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  interval = EXCLUDED.interval,
  features = EXCLUDED.features,
  max_properties = EXCLUDED.max_properties,
  max_searches = EXCLUDED.max_searches,
  ai_analysis_included = EXCLUDED.ai_analysis_included,
  priority = EXCLUDED.priority,
  updated_at = NOW();
