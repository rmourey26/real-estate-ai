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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, Crown, Zap, Star, Scale } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PlanComparisonModalProps {
  currentPlanId: string
  onUpgrade: (planId: string) => Promise<void>
}

// Mock subscription plans with detailed features
const subscriptionPlans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for getting started with real estate investing",
    price: 29,
    interval: "month",
    icon: Zap,
    features: {
      propertySearches: "50 per month",
      savedProperties: "10",
      marketInsights: "Basic",
      aiAnalysis: false,
      investmentCalculator: true,
      neighborhoodAnalysis: "Limited",
      cmaReports: false,
      prioritySupport: false,
      apiAccess: false,
      teamCollaboration: false,
      customIntegrations: false,
      whiteLabel: false,
    },
  },
  {
    id: "professional",
    name: "Professional",
    description: "For serious investors and real estate professionals",
    price: 79,
    interval: "month",
    icon: Star,
    popular: true,
    features: {
      propertySearches: "Unlimited",
      savedProperties: "100",
      marketInsights: "Advanced",
      aiAnalysis: true,
      investmentCalculator: true,
      neighborhoodAnalysis: "Full",
      cmaReports: "Unlimited",
      prioritySupport: true,
      apiAccess: false,
      teamCollaboration: false,
      customIntegrations: false,
      whiteLabel: false,
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For teams and large-scale operations",
    price: 199,
    interval: "month",
    icon: Crown,
    features: {
      propertySearches: "Unlimited",
      savedProperties: "Unlimited",
      marketInsights: "Premium",
      aiAnalysis: true,
      investmentCalculator: true,
      neighborhoodAnalysis: "Full",
      cmaReports: "Unlimited",
      prioritySupport: true,
      apiAccess: true,
      teamCollaboration: true,
      customIntegrations: true,
      whiteLabel: true,
    },
  },
]

const featureLabels = {
  propertySearches: "Property Searches",
  savedProperties: "Saved Properties",
  marketInsights: "Market Insights",
  aiAnalysis: "AI Analysis",
  investmentCalculator: "Investment Calculator",
  neighborhoodAnalysis: "Neighborhood Analysis",
  cmaReports: "CMA Reports",
  prioritySupport: "Priority Support",
  apiAccess: "API Access",
  teamCollaboration: "Team Collaboration",
  customIntegrations: "Custom Integrations",
  whiteLabel: "White Label",
}

export function PlanComparisonModal({ currentPlanId, onUpgrade }: PlanComparisonModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleUpgrade = async (planId: string) => {
    setIsLoading(true)
    try {
      await onUpgrade(planId)
      setOpen(false)
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsLoading(false)
    }
  }

  const renderFeatureValue = (value: string | boolean) => {
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
          <Scale className="h-4 w-4" />
          <span>Compare Plans</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Scale className="h-5 w-5" />
            <span>Compare Subscription Plans</span>
          </DialogTitle>
          <DialogDescription>
            Choose the perfect plan for your real estate investment needs. Upgrade or downgrade anytime.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Features</th>
                    {subscriptionPlans.map((plan) => {
                      const Icon = plan.icon
                      const isCurrentPlan = plan.id === currentPlanId
                      return (
                        <th key={plan.id} className="text-center p-4 min-w-[200px]">
                          <div className="space-y-2">
                            <div className="flex items-center justify-center space-x-2">
                              <Icon className="h-5 w-5" />
                              <span className="font-semibold">{plan.name}</span>
                              {isCurrentPlan && (
                                <Badge variant="secondary" className="text-xs">
                                  Current
                                </Badge>
                              )}
                              {plan.popular && !isCurrentPlan && <Badge className="text-xs">Popular</Badge>}
                            </div>
                            <div className="flex items-baseline justify-center space-x-1">
                              <span className="text-2xl font-bold">${plan.price}</span>
                              <span className="text-sm text-muted-foreground">/{plan.interval}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{plan.description}</p>
                          </div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(featureLabels).map(([key, label]) => (
                    <tr key={key} className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium">{label}</td>
                      {subscriptionPlans.map((plan) => (
                        <td key={plan.id} className="p-4 text-center">
                          {renderFeatureValue(plan.features[key as keyof typeof plan.features])}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-4"></td>
                    {subscriptionPlans.map((plan) => {
                      const isCurrentPlan = plan.id === currentPlanId
                      return (
                        <td key={plan.id} className="p-4">
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
                              {subscriptionPlans.find((p) => p.id === currentPlanId)?.price! < plan.price
                                ? "Upgrade"
                                : "Downgrade"}
                            </Button>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {subscriptionPlans.map((plan) => {
              const Icon = plan.icon
              const isCurrentPlan = plan.id === currentPlanId
              return (
                <Card key={plan.id} className={`${plan.popular ? "border-primary" : ""}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5" />
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        {isCurrentPlan && (
                          <Badge variant="secondary" className="text-xs">
                            Current
                          </Badge>
                        )}
                        {plan.popular && !isCurrentPlan && <Badge className="text-xs">Popular</Badge>}
                      </div>
                      <div className="text-right">
                        <div className="flex items-baseline space-x-1">
                          <span className="text-xl font-bold">${plan.price}</span>
                          <span className="text-sm text-muted-foreground">/{plan.interval}</span>
                        </div>
                      </div>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      {Object.entries(featureLabels).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{label}</span>
                          <div className="flex items-center">
                            {renderFeatureValue(plan.features[key as keyof typeof plan.features])}
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
                        {subscriptionPlans.find((p) => p.id === currentPlanId)?.price! < plan.price
                          ? "Upgrade"
                          : "Downgrade"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* FAQ Section */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">Frequently Asked Questions</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• You can upgrade or downgrade your plan at any time</p>
              <p>• Changes take effect immediately with prorated billing</p>
              <p>• All plans include a 30-day money-back guarantee</p>
              <p>• Enterprise plans include dedicated support and custom onboarding</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
