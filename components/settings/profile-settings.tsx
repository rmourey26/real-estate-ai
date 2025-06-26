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
import { updateUserProfile } from "@/app/actions/user-settings" // This action will also need update
import { Loader2, User } from "lucide-react"
import { createClient } from "@/utils/supabase/client" // Client-side Supabase

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

  useEffect(() => {
    async function loadProfile() {
      setIsLoadingProfile(true)
      try {
        const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

        if (error) {
          console.error("Error loading profile:", error.message)
          toast({
            title: "Error",
            description: "Failed to load profile data.",
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
        const message = error instanceof Error ? error.message : "Unknown error"
        console.error("Unexpected error loading profile:", message)
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading profile data.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingProfile(false)
      }
    }

    if (userId) {
      loadProfile()
    }
  }, [userId, supabase, form, toast])

  const onSubmit = async (data: UpdateProfileInput) => {
    setIsLoading(true)

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })

    try {
      const result = await updateUserProfile(formData) // This server action needs to use 'profiles'

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else if (result?.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully.",
        })
      } else {
        toast({
          title: "Notice",
          description: "Profile update processed, but no specific status returned.",
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      toast({
        title: "Error",
        description: `Failed to update profile: ${message}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg border">
        <div className="p-3 bg-primary/10 rounded-full">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">
            {form.watch("firstName") || form.watch("lastName")
              ? `${form.watch("firstName")} ${form.watch("lastName")}`.trim()
              : "Your Profile"}
          </h3>
          <ProfileEmail userId={userId} />
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ... (form fields remain the same, ensure IDs and labels are correct) ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" {...form.register("firstName")} placeholder="Your first name" />
            {form.formState.errors.firstName && (
              <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" {...form.register("lastName")} placeholder="Your last name" />
            {form.formState.errors.lastName && (
              <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input id="phone" {...form.register("phone")} placeholder="e.g., +1 555-123-4567" type="tel" />
          {form.formState.errors.phone && (
            <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company (Optional)</Label>
          <Input id="company" {...form.register("company")} placeholder="Your company name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio (Optional)</Label>
          <Textarea id="bio" {...form.register("bio")} placeholder="Tell us a bit about yourself" rows={4} />
          {form.formState.errors.bio && <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              name="timezone"
              value={form.watch("timezone")}
              onValueChange={(value) => form.setValue("timezone", value, { shouldValidate: true })}
            >
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (US & Canada)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (US & Canada)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                <SelectItem value="Europe/London">London (GMT/BST)</SelectItem>
                <SelectItem value="Europe/Berlin">Central European Time (Berlin)</SelectItem>
                <SelectItem value="Asia/Tokyo">Japan Standard Time (Tokyo)</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.timezone && (
              <p className="text-sm text-destructive">{form.formState.errors.timezone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              name="language"
              value={form.watch("language")}
              onValueChange={(value) => form.setValue("language", value, { shouldValidate: true })}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español (Spanish)</SelectItem>
                <SelectItem value="fr">Français (French)</SelectItem>
                <SelectItem value="de">Deutsch (German)</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.language && (
              <p className="text-sm text-destructive">{form.formState.errors.language.message}</p>
            )}
          </div>
        </div>

        <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </div>
  )
}

function ProfileEmail({ userId }: { userId: string }) {
  const [email, setEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadEmail() {
      setIsLoading(true)
      if (!userId) {
        setIsLoading(false)
        setEmail(null)
        return
      }
      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", userId)
          .single()

        if (profile?.email) {
          setEmail(profile.email)
        } else {
          if (profileError && profileError.code !== "PGRST116") {
            // PGRST116: row not found
            console.warn("Error fetching email from profile:", profileError.message)
          }
          // Fallback to auth user email if not in profiles or error
          const {
            data: { user },
            error: authError,
          } = await supabase.auth.getUser()
          if (user?.email) {
            setEmail(user.email)
          } else if (authError) {
            console.warn("Error fetching email from auth:", authError.message)
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error"
        console.error("Unexpected error loading email:", message)
      } finally {
        setIsLoading(false)
      }
    }
    loadEmail()
  }, [userId, supabase])

  if (isLoading) {
    return <div className="h-4 w-48 bg-muted animate-pulse rounded mt-1" />
  }

  return <p className="text-sm text-muted-foreground">{email || "Email not available"}</p>
}
