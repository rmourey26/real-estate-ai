"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { updateNotificationSettingsSchema, type UpdateNotificationSettingsInput } from "@/lib/schemas/user-settings"
import { updateNotificationSettings } from "@/app/actions/user-settings"
import { Loader2, Mail, Bell, TrendingUp, Home, DollarSign, FileText } from "lucide-react"

interface NotificationSettingsProps {
  userId: string
}

export function NotificationSettings({ userId }: NotificationSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<UpdateNotificationSettingsInput>({
    resolver: zodResolver(updateNotificationSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      dealAlerts: true,
      priceDropAlerts: true,
      newListingAlerts: true,
      weeklyReports: true,
    },
  })

  const onSubmit = async (data: UpdateNotificationSettingsInput) => {
    setIsLoading(true)

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value ? "on" : "off")
    })

    try {
      const result = await updateNotificationSettings(formData)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Notification settings updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const notificationOptions = [
    {
      key: "emailNotifications" as keyof UpdateNotificationSettingsInput,
      label: "Email Notifications",
      description: "Receive notifications via email",
      icon: Mail,
    },
    {
      key: "pushNotifications" as keyof UpdateNotificationSettingsInput,
      label: "Push Notifications",
      description: "Receive push notifications in your browser",
      icon: Bell,
    },
    {
      key: "marketingEmails" as keyof UpdateNotificationSettingsInput,
      label: "Marketing Emails",
      description: "Receive promotional emails and product updates",
      icon: TrendingUp,
    },
    {
      key: "dealAlerts" as keyof UpdateNotificationSettingsInput,
      label: "Deal Alerts",
      description: "Get notified about new investment opportunities",
      icon: DollarSign,
    },
    {
      key: "priceDropAlerts" as keyof UpdateNotificationSettingsInput,
      label: "Price Drop Alerts",
      description: "Get notified when property prices drop",
      icon: TrendingUp,
    },
    {
      key: "newListingAlerts" as keyof UpdateNotificationSettingsInput,
      label: "New Listing Alerts",
      description: "Get notified about new property listings",
      icon: Home,
    },
    {
      key: "weeklyReports" as keyof UpdateNotificationSettingsInput,
      label: "Weekly Reports",
      description: "Receive weekly market analysis reports",
      icon: FileText,
    },
  ]

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {notificationOptions.map((option) => {
          const Icon = option.icon
          return (
            <div key={option.key} className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <Label htmlFor={option.key} className="text-sm font-medium">
                    {option.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
              <Switch
                id={option.key}
                checked={form.watch(option.key)}
                onCheckedChange={(checked) => form.setValue(option.key, checked)}
              />
            </div>
          )
        })}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Preferences
      </Button>
    </form>
  )
}
