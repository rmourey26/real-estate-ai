"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Building, Home, Search, BarChart3, Map, Heart, Settings, LogOut, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
            <Building className="h-6 w-6" />
            <span>RealEstate AI</span>
          </Link>
        </div>
        <div className="px-3">
          <div className="space-y-1">
            <Link href="/dashboard">
              <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/deals">
              <Button
                variant={pathname === "/dashboard/deals" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Deal Alerts
              </Button>
            </Link>
            <Link href="/dashboard/search">
              <Button
                variant={pathname === "/dashboard/search" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Search className="mr-2 h-4 w-4" />
                Property Search
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button
                variant={pathname === "/dashboard/analytics" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Market Analytics
              </Button>
            </Link>
            <Link href="/dashboard/map">
              <Button variant={pathname === "/dashboard/map" ? "secondary" : "ghost"} className="w-full justify-start">
                <Map className="mr-2 h-4 w-4" />
                Market Map
              </Button>
            </Link>
            <Link href="/dashboard/saved">
              <Button
                variant={pathname === "/dashboard/saved" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Heart className="mr-2 h-4 w-4" />
                Saved Properties
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h3 className="mb-2 px-4 text-xs font-semibold">Settings</h3>
          <div className="space-y-1">
            <Link href="/dashboard/settings">
              <Button
                variant={pathname === "/dashboard/settings" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add default export
export default Sidebar
