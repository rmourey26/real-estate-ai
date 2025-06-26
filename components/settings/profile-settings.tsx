"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/schemas/user-settings"
import { updateUserProfile } from "@/app/actions/user-settings"
import { Loader2, User } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

interface ProfileSettingsProps {
  userId: string
}

export function ProfileSettings({ userId }: ProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      company: "",
      bio: "",
      timezone: "UTC",
      language: "en",
    },
  })

  // Load user profile data
  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: profile, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

        if (error) {
          console.error("Error loading profile:", error)
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          })
          return
        }

        if (profile) {
          form.reset({
            firstName: profile.first_name || "",
            lastName: profile.last_name || "",
            phone: profile.phone || "",
            company: profile.company || "",
            bio: profile.bio || "",
            timezone: profile.timezone || "UTC",
            language: profile.language || "en",
          })
        }
      } catch (error) {
        console.error("Unexpected error loading profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadProfile()
  }, [userId, supabase, form, toast])

  const onSubmit = async (data: UpdateProfileInput) => {
    setIsLoading(true)

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString())
      }
    })

    try {
      const result = await updateUserProfile(formData)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header with Email Display */}
      <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">
            {form.watch("firstName") || form.watch("lastName")
              ? `${form.watch("firstName")} ${form.watch("lastName")}`.trim()
              : "Your Profile"}
          </h3>
          <ProfileEmail userId={userId} />
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" {...form.register("firstName")} placeholder="Enter your first name" />
            {form.formState.errors.firstName && (
              <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" {...form.register("lastName")} placeholder="Enter your last name" />
            {form.formState.errors.lastName && (
              <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" {...form.register("phone")} placeholder="Enter your phone number" type="tel" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" {...form.register("company")} placeholder="Enter your company name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" {...form.register("bio")} placeholder="Tell us about yourself" rows={4} />
          {form.formState.errors.bio && <p className="text-sm text-red-500">{form.formState.errors.bio.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select onValueChange={(value) => form.setValue("timezone", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                <SelectItem value="Europe/London">London</SelectItem>
                <SelectItem value="Europe/Paris">Paris</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select onValueChange={(value) => form.setValue("language", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </div>
  )
}

// Separate component to display user email
function ProfileEmail({ userId }: { userId: string }) {
  const [email, setEmail] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadEmail() {
      try {
        // First try to get email from user_profiles table
        const { data: profile } = await supabase.from("user_profiles").select("email").eq("id", userId).single()

        if (profile?.email) {
          setEmail(profile.email)
        } else {
          // Fallback to auth user email
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (user?.email) {
            setEmail(user.email)
          }
        }
      } catch (error) {
        console.error("Error loading email:", error)
        // Try to get from auth as fallback
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user?.email) {
          setEmail(user.email)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadEmail()
  }, [userId, supabase])

  if (isLoading) {
    return <div className="h-4 w-48 bg-muted animate-pulse rounded" />
  }

  return <p className="text-sm text-muted-foreground">{email || "No email available"}</p>
}
