"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, Crown, Zap, Star, Scale } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PlanComparisonModalProps {
  currentPlanId?: string
  onUpgrade?: (planId: string) => void
}

const subscriptionPlans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for getting started",
    price: 29,
    interval: "month",
    icon: Zap,
    features: {
      "Property Searches": "50 per month",
      "Saved Properties": "10",
      "Market Insights": "Basic",
      "AI Analysis": false,
      "Investment Calculator": true,
      "Neighborhood Analysis": "Limited",
      "CMA Reports": false,
      "Priority Support": false,
      "API Access": false,
      "Team Collaboration": false,
      "Custom Integrations": false,
      "White Label": false,
    },
  },
  {
    id: "professional",
    name: "Professional",
    description: "For serious investors",
    price: 79,
    interval: "month",
    icon: Star,
    popular: true,
    features: {
      "Property Searches": "Unlimited",
      "Saved Properties": "100",
      "Market Insights": "Advanced",
      "AI Analysis": true,
      "Investment Calculator": true,
      "Neighborhood Analysis": "Full",
      "CMA Reports": "Unlimited",
      "Priority Support": true,
      "API Access": false,
      "Team Collaboration": false,
      "Custom Integrations": false,
      "White Label": false,
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For teams and large operations",
    price: 199,
    interval: "month",
    icon: Crown,
    features: {
      "Property Searches": "Unlimited",
      "Saved Properties": "Unlimited",
      "Market Insights": "Premium",
      "AI Analysis": true,
      "Investment Calculator": true,
      "Neighborhood Analysis": "Full",
      "CMA Reports": "Unlimited",
      "Priority Support": true,
      "API Access": true,
      "Team Collaboration": true,
      "Custom Integrations": true,
      "White Label": true,
    },
  },
]

const allFeatures = [
  "Property Searches",
  "Saved Properties",
  "Market Insights",
  "AI Analysis",
  "Investment Calculator",
  "Neighborhood Analysis",
  "CMA Reports",
  "Priority Support",
  "API Access",
  "Team Collaboration",
  "Custom Integrations",
  "White Label",
]

export function PlanComparisonModal({ currentPlanId, onUpgrade }: PlanComparisonModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleUpgrade = async (planId: string) => {
    if (planId === currentPlanId) return

    setIsLoading(true)
    try {
      if (onUpgrade) {
        await onUpgrade(planId)
      }
      toast({
        title: "Redirecting to checkout",
        description: "You will be redirected to complete your subscription upgrade.",
      })
      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate plan change",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderFeatureValue = (value: string | boolean) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-4 w-4 text-green-500 mx-auto" />
      ) : (
        <X className="h-4 w-4 text-gray-300 mx-auto" />
      )
    }
    return <span className="text-sm text-center">{value}</span>
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
          <Scale className="h-4 w-4" />
          <span>Compare Plans</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Scale className="h-5 w-5" />
            <span>Compare Subscription Plans</span>
          </DialogTitle>
          <DialogDescription>Choose the perfect plan for your real estate investment needs</DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {/* Mobile View - Stacked Cards */}
          <div className="block lg:hidden space-y-4">
            {subscriptionPlans.map((plan) => {
              const Icon = plan.icon
              const isCurrentPlan = plan.id === currentPlanId

              return (
                <Card
                  key={plan.id}
                  className={`${plan.popular ? "border-primary" : ""} ${isCurrentPlan ? "bg-primary/5" : ""}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5" />
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        {plan.popular && <Badge>Most Popular</Badge>}
                        {isCurrentPlan && (
                          <Badge variant="secondary" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${plan.price}</div>
                        <div className="text-sm text-muted-foreground">per month</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      {allFeatures.map((feature) => (
                        <div key={feature} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{feature}</span>
                          <div className="flex items-center">
                            {renderFeatureValue(plan.features[feature as keyof typeof plan.features])}
                          </div>
                        </div>
                      ))}
                    </div>
                    {isCurrentPlan ? (
                      <Button disabled className="w-full">
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={isLoading}
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {currentPlanId &&
                        subscriptionPlans.find((p) => p.id === currentPlanId)?.price &&
                        plan.price > (subscriptionPlans.find((p) => p.id === currentPlanId)?.price || 0)
                          ? "Upgrade"
                          : "Select Plan"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Desktop View - Side by Side Table */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-4 w-1/4">
                      <div className="text-lg font-semibold">Features</div>
                    </th>
                    {subscriptionPlans.map((plan) => {
                      const Icon = plan.icon
                      const isCurrentPlan = plan.id === currentPlanId

                      return (
                        <th key={plan.id} className="p-4 w-1/4">
                          <Card
                            className={`${plan.popular ? "border-primary" : ""} ${isCurrentPlan ? "bg-primary/5" : ""}`}
                          >
                            <CardHeader className="pb-3">
                              <div className="text-center space-y-2">
                                <div className="flex items-center justify-center space-x-2">
                                  <Icon className="h-5 w-5" />
                                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                                </div>
                                {plan.popular && <Badge className="mx-auto">Most Popular</Badge>}
                                {isCurrentPlan && (
                                  <Badge variant="secondary" className="text-xs mx-auto">
                                    Current Plan
                                  </Badge>
                                )}
                                <div className="text-center">
                                  <div className="text-3xl font-bold">${plan.price}</div>
                                  <div className="text-sm text-muted-foreground">per month</div>
                                </div>
                                <p className="text-sm text-muted-foreground">{plan.description}</p>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              {isCurrentPlan ? (
                                <Button disabled className="w-full">
                                  Current Plan
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => handleUpgrade(plan.id)}
                                  disabled={isLoading}
                                  className="w-full"
                                  variant={plan.popular ? "default" : "outline"}
                                >
                                  {currentPlanId &&
                                  subscriptionPlans.find((p) => p.id === currentPlanId)?.price &&
                                  plan.price > (subscriptionPlans.find((p) => p.id === currentPlanId)?.price || 0)
                                    ? "Upgrade"
                                    : "Select Plan"}
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((feature, index) => (
                    <tr key={feature} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                      <td className="p-4 font-medium border-r">{feature}</td>
                      {subscriptionPlans.map((plan) => (
                        <td key={plan.id} className="p-4 text-center border-r">
                          {renderFeatureValue(plan.features[feature as keyof typeof plan.features])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">Need help choosing?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Starter:</strong> Perfect for beginners exploring real estate investment opportunities.
              </div>
              <div>
                <strong>Professional:</strong> Ideal for active investors who need advanced tools and unlimited
                searches.
              </div>
              <div>
                <strong>Enterprise:</strong> Best for teams, agencies, and large-scale operations requiring full access.
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold">Frequently Asked Questions</h4>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Can I change my plan anytime?</strong> Yes, you can upgrade or downgrade your plan at any time.
              </div>
              <div>
                <strong>What happens to my data if I downgrade?</strong> Your data is preserved, but access may be
                limited based on your new plan's features.
              </div>
              <div>
                <strong>Do you offer refunds?</strong> We offer a 30-day money-back guarantee for all new subscriptions.
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
