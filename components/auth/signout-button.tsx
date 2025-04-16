"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "@/app/actions/auth"

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button variant="ghost" type="submit">
        Sign Out
      </Button>
    </form>
  )
}
