"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, Star, Loader2 } from "lucide-react"

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: "month" | "year"
  features: string[]
  description: string
  popular?: boolean
}

interface PlanComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  plans: SubscriptionPlan[]
  currentPlanId?: string
}

const featureMatrix = [
  { feature: "Property Searches", starter: "50 per month", professional: "Unlimited", enterprise: "Unlimited" },
  { feature: "Saved Properties", starter: "10", professional: "100", enterprise: "Unlimited" },
  { feature: "Market Insights", starter: "Basic", professional: "Advanced", enterprise: "Premium" },
  { feature: "AI Analysis", starter: false, professional: true, enterprise: true },
  { feature: "Investment Calculator", starter: true, professional: true, enterprise: true },
  { feature: "Neighborhood Analysis", starter: "Limited", professional: "Full", enterprise: "Full" },
  { feature: "CMA Reports", starter: false, professional: "Unlimited", enterprise: "Unlimited" },
  { feature: "Priority Support", starter: false, professional: true, enterprise: true },
  { feature: "API Access", starter: false, professional: false, enterprise: true },
  { feature: "Team Collaboration", starter: false, professional: false, enterprise: true },
  { feature: "Custom Integrations", starter: false, professional: false, enterprise: true },
  { feature: "White Label", starter: false, professional: false, enterprise: true },
]

export function PlanComparisonModal({ isOpen, onClose, plans, currentPlanId }: PlanComparisonModalProps) {
  const [upgrading, setUpgrading] = useState<string | null>(null)

  const handleUpgrade = async (planId: string) => {
    setUpgrading(planId)
    // Simulate upgrade process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setUpgrading(null)
    onClose()
  }

  const renderFeatureValue = (value: string | boolean, planId: string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-4 w-4 text-green-500 mx-auto" />
      ) : (
        <X className="h-4 w-4 text-red-500 mx-auto" />
      )
    }
    return <span className="text-sm text-center">{value}</span>
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Compare Subscription Plans
          </DialogTitle>
          <DialogDescription>Choose the plan that best fits your real estate investment needs</DialogDescription>
        </DialogHeader>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 border-b">Features</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="text-center p-4 border-b min-w-[200px]">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <h3 className="font-semibold">{plan.name}</h3>
                          {plan.popular && <Badge className="bg-primary text-primary-foreground">Popular</Badge>}
                          {currentPlanId === plan.id && (
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-baseline justify-center space-x-1">
                          <span className="text-2xl font-bold">${plan.price}</span>
                          <span className="text-sm text-muted-foreground">/month</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{plan.description}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureMatrix.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4 text-center">{renderFeatureValue(row.starter, "starter")}</td>
                    <td className="p-4 text-center">{renderFeatureValue(row.professional, "professional")}</td>
                    <td className="p-4 text-center">{renderFeatureValue(row.enterprise, "enterprise")}</td>
                  </tr>
                ))}
                <tr>
                  <td className="p-4"></td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="p-4 text-center">
                      <Button
                        className="w-full"
                        variant={currentPlanId === plan.id ? "outline" : plan.popular ? "default" : "outline"}
                        disabled={currentPlanId === plan.id || upgrading === plan.id}
                        onClick={() => handleUpgrade(plan.id)}
                      >
                        {upgrading === plan.id ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                          </div>
                        ) : currentPlanId === plan.id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            Current Plan
                          </div>
                        ) : (
                          `${plan.price > (plans.find((p) => p.id === currentPlanId)?.price || 0) ? "Upgrade" : "Downgrade"} to ${plan.name}`
                        )}
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`${plan.popular ? "border-primary" : ""} ${currentPlanId === plan.id ? "bg-primary/5 border-primary/20" : ""}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle>{plan.name}</CardTitle>
                    {plan.popular && <Badge className="bg-primary text-primary-foreground">Popular</Badge>}
                    {currentPlanId === plan.id && (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-bold">${plan.price}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {featureMatrix.map((row, index) => {
                    const value =
                      plan.id === "starter"
                        ? row.starter
                        : plan.id === "professional"
                          ? row.professional
                          : row.enterprise
                    return (
                      <div key={index} className="flex items-center justify-between py-1">
                        <span className="text-sm">{row.feature}</span>
                        <div className="flex items-center">{renderFeatureValue(value, plan.id)}</div>
                      </div>
                    )
                  })}
                </div>
                <Button
                  className="w-full"
                  variant={currentPlanId === plan.id ? "outline" : plan.popular ? "default" : "outline"}
                  disabled={currentPlanId === plan.id || upgrading === plan.id}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {upgrading === plan.id ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </div>
                  ) : currentPlanId === plan.id ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Current Plan
                    </div>
                  ) : (
                    `${plan.price > (plans.find((p) => p.id === currentPlanId)?.price || 0) ? "Upgrade" : "Downgrade"} to ${plan.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Can I change plans anytime?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">What happens to my data?</h4>
              <p className="text-sm text-muted-foreground">
                All your saved properties and analysis history are preserved when changing plans.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Is there a money-back guarantee?</h4>
              <p className="text-sm text-muted-foreground">Yes, we offer a 30-day money-back guarantee on all plans.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">How does billing work?</h4>
              <p className="text-sm text-muted-foreground">
                You're billed monthly in advance. Upgrades are prorated automatically.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
