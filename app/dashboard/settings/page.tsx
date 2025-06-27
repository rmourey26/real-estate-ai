import { Suspense } from "react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { PrivacySettings } from "@/components/settings/privacy-settings"
import { SubscriptionSettings } from "@/components/settings/subscription-settings"
import { BillingHistory } from "@/components/settings/billing-history"
import { DangerZone } from "@/components/settings/danger-zone"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

export default async function SettingsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">
          Manage your account settings, subscription, and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
        {/* Mobile-optimized tabs list */}
        <div className="w-full">
          <ScrollArea className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto p-1 bg-muted rounded-lg">
              <TabsTrigger
                value="profile"
                className="text-xs sm:text-sm px-2 py-2 sm:px-3 data-[state=active]:bg-background"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="text-xs sm:text-sm px-2 py-2 sm:px-3 data-[state=active]:bg-background"
              >
                <span className="hidden sm:inline">Notifications</span>
                <span className="sm:hidden">Notify</span>
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className="text-xs sm:text-sm px-2 py-2 sm:px-3 data-[state=active]:bg-background"
              >
                Privacy
              </TabsTrigger>
              <TabsTrigger
                value="subscription"
                className="text-xs sm:text-sm px-2 py-2 sm:px-3 data-[state=active]:bg-background"
              >
                <span className="hidden sm:inline">Subscription</span>
                <span className="sm:hidden">Plan</span>
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="text-xs sm:text-sm px-2 py-2 sm:px-3 data-[state=active]:bg-background"
              >
                Billing
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="text-xs sm:text-sm px-2 py-2 sm:px-3 data-[state=active]:bg-background"
              >
                Account
              </TabsTrigger>
            </TabsList>
          </ScrollArea>
        </div>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Profile Information</CardTitle>
              <CardDescription className="text-sm">Update your personal information and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Suspense fallback={<ProfileSkeleton />}>
                <ProfileSettings userId={user.id} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Notification Preferences</CardTitle>
              <CardDescription className="text-sm">
                Choose how you want to be notified about updates and alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Suspense fallback={<NotificationSkeleton />}>
                <NotificationSettings userId={user.id} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Privacy Settings</CardTitle>
              <CardDescription className="text-sm">Control your privacy and data sharing preferences.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Suspense fallback={<PrivacySkeleton />}>
                <PrivacySettings userId={user.id} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Subscription Management</CardTitle>
              <CardDescription className="text-sm">
                Manage your subscription plan and billing preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Suspense fallback={<SubscriptionSkeleton />}>
                <SubscriptionSettings userId={user.id} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Billing History</CardTitle>
              <CardDescription className="text-sm">View your billing history and download invoices.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Suspense fallback={<BillingSkeleton />}>
                <BillingHistory userId={user.id} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Account Management</CardTitle>
              <CardDescription className="text-sm">Manage your account security and deletion options.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <DangerZone userEmail={user.email!} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-20 w-full" />
      </div>
      <Skeleton className="h-10 w-24" />
    </div>
  )
}

function NotificationSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2">
          <div className="space-y-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-6 w-11" />
        </div>
      ))}
    </div>
  )
}

function PrivacySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2">
          <div className="space-y-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-6 w-11" />
        </div>
      ))}
    </div>
  )
}

function SubscriptionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

function BillingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="text-right space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  )
}
