// components/auth/SignInButton.tsx
"use client"

import { signIn } from "next-auth/react"

export function SignInButton() {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await signIn("github");
      }}
    >
      <button type="submit">Login</button>
    </form>
  )
}