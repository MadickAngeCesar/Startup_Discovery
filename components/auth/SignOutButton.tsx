"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await signOut({ callbackUrl: "/" });
      }}
    >
      <button type="submit" className="flex items-center">
        <span className="max-sm:hidden">Logout</span>
        <LogOut className="size-6 sm:hidden text-red-500" />
      </button>
    </form>
  )
}