import type React from "react"
import { Suspense } from "react"
import Sidebar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar className="hidden md:block w-64 border-r" />
      <div className="flex-1">
        <Suspense fallback={<div className="h-16 border-b"></div>}>
          <Header />
        </Suspense>
        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}
