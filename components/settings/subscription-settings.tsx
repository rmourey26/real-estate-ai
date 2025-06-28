"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Star, Check, CreditCard, Calendar, BarChart3 } from "lucide-react"
import { PlanComparisonModal } from "./plan-comparison-modal"

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: "month" | "year"
  features: string[]
  description: string
  popular?: boolean
}

interface UserSubscription {
  id: string
  plan_id: string
  status: "active" | "canceled" | "past_due"
  current_period_end: string
  cancel_at_period_end: boolean
}

interface SubscriptionUsage {
  property_searches: { used: number; limit: number }
  saved_properties: { used: number; limit: number }
  ai_analyses: { used: number; limit: number }
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    interval: "month",
    description: "Perfect for getting started with real estate investing",
    features: [
      "50 property searches per month",
      "10 saved properties",
      "Basic market insights",
      "Investment calculator",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 79,
    interval: "month",
    description: "For serious investors and real estate professionals",
    popular: true,
    features: [
      "Unlimited property searches",
      "100 saved properties",
      "Advanced market insights",
      "AI-powered analysis",
      "Neighborhood analysis",
      "CMA reports",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    interval: "month",
    description: "For teams and large-scale operations",
    features: [
      "Everything in Professional",
      "Unlimited saved properties",
      "Team collaboration",
      "API access",
      "Custom integrations",
      "White-label options",
      "Dedicated support",
    ],
  },
]

export function SubscriptionSettings() {
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [usage, setUsage] = useState<SubscriptionUsage | null>(null)
  const [showComparison, setShowComparison] = useState(false)

  useEffect(() => {
    // Simulate loading subscription data
    setTimeout(() => {
      setSubscription({
        id: "sub_123",
        plan_id: "professional",
        status: "active",
        current_period_end: "2024-02-14",
        cancel_at_period_end: false,
      })

      setUsage({
        property_searches: { used: 127, limit: -1 }, // -1 for unlimited
        saved_properties: { used: 23, limit: 100 },
        ai_analyses: { used: 45, limit: -1 },
      })

      setLoading(false)
    }, 1000)
  }, [])

  const currentPlan = subscription ? subscriptionPlans.find((p) => p.id === subscription.plan_id) : null

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading subscription details...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      {subscription && currentPlan && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Star className="h-6 w-6 text-primary" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                </div>
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{currentPlan.name}</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800 text-xs px-2 py-0.5 h-5">
                      Current
                    </Badge>
                  </CardTitle>
                  <CardDescription>{currentPlan.description}</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold">${currentPlan.price}</span>
                  <span className="text-sm text-muted-foreground font-medium">/month</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Next billing date
                </h4>
                <p className="text-sm text-muted-foreground">{subscription.current_period_end}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Status</h4>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  {subscription.status}
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowComparison(true)} className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Compare Plans
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <CreditCard className="h-4 w-4" />
                Manage Billing
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Statistics */}
      {usage && (
        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>Track your current usage against plan limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Property Searches</span>
                  <span>
                    {usage.property_searches.used}
                    {usage.property_searches.limit > 0 ? ` / ${usage.property_searches.limit}` : " (Unlimited)"}
                  </span>
                </div>
                <Progress
                  value={
                    usage.property_searches.limit > 0
                      ? (usage.property_searches.used / usage.property_searches.limit) * 100
                      : 100
                  }
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Saved Properties</span>
                  <span>
                    {usage.saved_properties.used}
                    {usage.saved_properties.limit > 0 ? ` / ${usage.saved_properties.limit}` : " (Unlimited)"}
                  </span>
                </div>
                <Progress
                  value={
                    usage.saved_properties.limit > 0
                      ? (usage.saved_properties.used / usage.saved_properties.limit) * 100
                      : 100
                  }
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>AI Analyses</span>
                  <span>
                    {usage.ai_analyses.used}
                    {usage.ai_analyses.limit > 0 ? ` / ${usage.ai_analyses.limit}` : " (Unlimited)"}
                  </span>
                </div>
                <Progress
                  value={usage.ai_analyses.limit > 0 ? (usage.ai_analyses.used / usage.ai_analyses.limit) * 100 : 100}
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>Choose the plan that best fits your needs</CardDescription>
          </div>
          <Button variant="outline" onClick={() => setShowComparison(true)} className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Compare Plans
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {subscriptionPlans.map((plan) => {
              const isCurrentPlan = subscription?.plan_id === plan.id

              return (
                <Card
                  key={plan.id}
                  className={`relative ${isCurrentPlan ? "opacity-75 bg-primary/5 border-primary/20" : ""} ${plan.popular ? "border-primary" : ""}`}
                >
                  {plan.popular && !isCurrentPlan && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                      Most Popular
                    </Badge>
                  )}
                  {isCurrentPlan && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                      Active Plan
                    </Badge>
                  )}

                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                      {plan.name}
                      {isCurrentPlan && (
                        <div className="relative">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        </div>
                      )}
                    </CardTitle>
                    <div className="flex items-baseline justify-center space-x-1">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-sm text-muted-foreground font-medium">/month</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? "outline" : plan.popular ? "default" : "outline"}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          Current Plan
                        </div>
                      ) : plan.price > (currentPlan?.price || 0) ? (
                        "Upgrade"
                      ) : (
                        "Downgrade"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <PlanComparisonModal
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        plans={subscriptionPlans}
        currentPlanId={subscription?.plan_id}
      />
    </div>
  )
}
