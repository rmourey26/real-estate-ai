"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Check, Crown, Zap, Star } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SubscriptionSettingsProps {
  userId: string
}

// Mock subscription plans
const subscriptionPlans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for getting started with real estate investing",
    price: 29,
    interval: "month",
    features: ["Up to 10 property searches per month", "Basic market insights", "Email support", "Property alerts"],
    maxProperties: 10,
    maxSearches: 50,
    aiAnalysisIncluded: false,
    icon: Zap,
  },
  {
    id: "professional",
    name: "Professional",
    description: "For serious investors and real estate professionals",
    price: 79,
    interval: "month",
    features: [
      "Unlimited property searches",
      "Advanced AI market analysis",
      "Priority support",
      "Custom property alerts",
      "Investment calculator",
      "Neighborhood analysis",
    ],
    maxProperties: 100,
    maxSearches: -1,
    aiAnalysisIncluded: true,
    icon: Star,
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For teams and large-scale operations",
    price: 199,
    interval: "month",
    features: [
      "Everything in Professional",
      "Team collaboration tools",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "White-label options",
    ],
    maxProperties: -1,
    maxSearches: -1,
    aiAnalysisIncluded: true,
    icon: Crown,
  },
]

// Mock current subscription
const currentSubscription = {
  id: "sub_123",
  planId: "professional",
  status: "active",
  currentPeriodEnd: new Date("2024-02-15"),
  cancelAtPeriodEnd: false,
}

export function SubscriptionSettings({ userId }: SubscriptionSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const currentPlan = subscriptionPlans.find((plan) => plan.id === currentSubscription.planId)

  const handleUpgrade = async (planId: string) => {
    setIsLoading(true)
    try {
      // Mock checkout session creation
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Redirecting to checkout",
        description: "You will be redirected to complete your subscription upgrade.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async (immediate = false) => {
    setIsLoading(true)
    try {
      // Mock cancellation
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Subscription updated",
        description: immediate
          ? "Your subscription has been cancelled immediately."
          : "Your subscription will be cancelled at the end of the current billing period.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReactivateSubscription = async () => {
    setIsLoading(true)
    try {
      // Mock reactivation
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Subscription reactivated",
        description: "Your subscription has been reactivated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reactivate subscription",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      {currentPlan && (
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <currentPlan.icon className="h-5 w-5" />
                  {/* Green beacon indicator */}
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white">
                    <div className="h-full w-full bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg">{currentPlan.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 h-5">
                    Current
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${currentPlan.price}</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
            </div>
            <CardDescription>{currentPlan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Next billing date</p>
                  <p className="text-sm text-muted-foreground">
                    {currentSubscription.currentPeriodEnd.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant={currentSubscription.status === "active" ? "default" : "secondary"}>
                      {currentSubscription.status}
                    </Badge>
                    {currentSubscription.cancelAtPeriodEnd && <Badge variant="destructive">Cancelling</Badge>}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                {!currentSubscription.cancelAtPeriodEnd ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Cancel Subscription
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel your subscription? You can choose to cancel immediately or at
                          the end of your current billing period.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleCancelSubscription(false)}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          Cancel at Period End
                        </AlertDialogAction>
                        <AlertDialogAction
                          onClick={() => handleCancelSubscription(true)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Cancel Immediately
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleReactivateSubscription} disabled={isLoading}>
                    Reactivate Subscription
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => {
            const Icon = plan.icon
            const isCurrentPlan = plan.id === currentSubscription.planId

            return (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? "border-primary" : ""} ${isCurrentPlan ? "opacity-75" : ""}`}
              >
                {plan.popular && !isCurrentPlan && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">Most Popular</Badge>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-1 bg-green-100 text-green-800 border-green-200"
                    >
                      <div className="flex items-center space-x-1">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span>Active Plan</span>
                      </div>
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Icon className="h-5 w-5" />
                      {isCurrentPlan && (
                        <div className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-green-500 rounded-full border border-white"></div>
                      )}
                    </div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{plan.name}</span>
                    </CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/{plan.interval}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan ? (
                    <Button disabled className="w-full bg-green-100 text-green-800 hover:bg-green-100">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span>Current Plan</span>
                      </div>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isLoading}
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {currentPlan && plan.price > currentPlan.price ? "Upgrade" : "Downgrade"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Usage Information */}
      <Card>
        <CardHeader>
          <CardTitle>Current Usage</CardTitle>
          <CardDescription>Your usage for the current billing period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">47</div>
              <div className="text-sm text-muted-foreground">
                Property Searches
                {currentPlan?.maxSearches === -1 ? " (Unlimited)" : ` / ${currentPlan?.maxSearches}`}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width:
                      currentPlan?.maxSearches === -1 ? "100%" : `${(47 / (currentPlan?.maxSearches || 50)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">
                Saved Properties
                {currentPlan?.maxProperties === -1 ? " (Unlimited)" : ` / ${currentPlan?.maxProperties}`}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width:
                      currentPlan?.maxProperties === -1
                        ? "100%"
                        : `${(12 / (currentPlan?.maxProperties || 10)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm text-muted-foreground">
                AI Analyses Used
                {currentPlan?.aiAnalysisIncluded ? " (Included)" : " (Not Available)"}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-purple-600 h-2 rounded-full w-4/5"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
