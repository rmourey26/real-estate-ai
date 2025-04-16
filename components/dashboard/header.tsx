import { SignOutButton } from "@/components/auth/signout-button"
import { Button } from "@/components/ui/button"
import { Bell, MessageSquare, Settings, User } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
              <span className="sr-only">Messages</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
            <SignOutButton />
          </nav>
        </div>
      </div>
    </header>
  )
}

// Add default export
export default Header
