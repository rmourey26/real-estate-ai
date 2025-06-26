"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { updatePrivacySettingsSchema, type UpdatePrivacySettingsInput } from "@/lib/schemas/user-settings"
import { Loader2, Eye, Shield, BarChart3, Share2 } from "lucide-react"

interface PrivacySettingsProps {
  userId: string
}

export function PrivacySettings({ userId }: PrivacySettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<UpdatePrivacySettingsInput>({
    resolver: zodResolver(updatePrivacySettingsSchema),
    defaultValues: {
      profileVisibility: "private",
      showEmail: false,
      showPhone: false,
      dataSharing: false,
      analyticsTracking: true,
    },
  })

  const onSubmit = async (data: UpdatePrivacySettingsInput) => {
    setIsLoading(true)

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Privacy settings updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update privacy settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-6">
        {/* Profile Visibility */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-muted-foreground" />
            <Label className="text-base font-medium">Profile Visibility</Label>
          </div>
          <p className="text-sm text-muted-foreground">Control who can see your profile information</p>
          <Select
            value={form.watch("profileVisibility")}
            onValueChange={(value: "public" | "private") => form.setValue("profileVisibility", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
              <SelectItem value="private">Private - Only you can see your profile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Contact Information Visibility */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Share2 className="h-5 w-5 text-muted-foreground" />
            <Label className="text-base font-medium">Contact Information</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Choose what contact information to display on your public profile
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="showEmail" className="text-sm font-medium">
                  Show Email Address
                </Label>
                <p className="text-sm text-muted-foreground">Display your email address on your public profile</p>
              </div>
              <Switch
                id="showEmail"
                checked={form.watch("showEmail")}
                onCheckedChange={(checked) => form.setValue("showEmail", checked)}
                disabled={form.watch("profileVisibility") === "private"}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="showPhone" className="text-sm font-medium">
                  Show Phone Number
                </Label>
                <p className="text-sm text-muted-foreground">Display your phone number on your public profile</p>
              </div>
              <Switch
                id="showPhone"
                checked={form.watch("showPhone")}
                onCheckedChange={(checked) => form.setValue("showPhone", checked)}
                disabled={form.watch("profileVisibility") === "private"}
              />
            </div>
          </div>
        </div>

        {/* Data & Analytics */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <Label className="text-base font-medium">Data & Analytics</Label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dataSharing" className="text-sm font-medium">
                  Data Sharing
                </Label>
                <p className="text-sm text-muted-foreground">Allow sharing of anonymized data for market research</p>
              </div>
              <Switch
                id="dataSharing"
                checked={form.watch("dataSharing")}
                onCheckedChange={(checked) => form.setValue("dataSharing", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analyticsTracking" className="text-sm font-medium">
                  Analytics Tracking
                </Label>
                <p className="text-sm text-muted-foreground">Help us improve our service by allowing usage analytics</p>
              </div>
              <Switch
                id="analyticsTracking"
                checked={form.watch("analyticsTracking")}
                onCheckedChange={(checked) => form.setValue("analyticsTracking", checked)}
              />
            </div>
          </div>
        </div>

        {/* Data Protection Notice */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-start space-x-2">
            <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium">Data Protection</h4>
              <p className="text-sm text-muted-foreground mt-1">
                We take your privacy seriously. All data is encrypted and stored securely. You can request a copy of
                your data or delete your account at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Privacy Settings
      </Button>
    </form>
  )
}
