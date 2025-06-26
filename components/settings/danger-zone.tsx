"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { deleteUserAccount } from "@/app/actions/user-settings"
import { AlertTriangle, Loader2 } from "lucide-react"
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

interface DangerZoneProps {
  userEmail: string
}

const deleteAccountSchema = z.object({
  confirmEmail: z.string().email("Please enter a valid email address"),
})

type DeleteAccountInput = z.infer<typeof deleteAccountSchema>

export function DangerZone({ userEmail }: DangerZoneProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      confirmEmail: "",
    },
  })

  const onDeleteAccount = async (data: DeleteAccountInput) => {
    if (data.confirmEmail !== userEmail) {
      form.setError("confirmEmail", {
        message: "Email does not match your account email",
      })
      return
    }

    setIsLoading(true)

    const formData = new FormData()
    formData.append("confirmEmail", data.confirmEmail)

    try {
      const result = await deleteUserAccount(formData)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted.",
        })
        // Redirect will be handled by the server action
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Account Deletion */}
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-900">Danger Zone</CardTitle>
          </div>
          <CardDescription className="text-red-700">Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-100 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
            <p className="text-sm text-red-700 mb-4">
              Once you delete your account, there is no going back. This will permanently delete your account, all your
              data, saved properties, and cancel any active subscriptions.
            </p>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data from
                    our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={form.handleSubmit(onDeleteAccount)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="confirmEmail">
                      Type your email address to confirm: <strong>{userEmail}</strong>
                    </Label>
                    <Input
                      id="confirmEmail"
                      {...form.register("confirmEmail")}
                      placeholder="Enter your email address"
                      type="email"
                    />
                    {form.formState.errors.confirmEmail && (
                      <p className="text-sm text-red-500">{form.formState.errors.confirmEmail.message}</p>
                    )}
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                    <AlertDialogAction type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Data Export */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Export Data</h4>
            <p className="text-sm text-blue-700 mb-4">
              Download a copy of all your data including saved properties, search history, and account information.
            </p>
            <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
              Export My Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
