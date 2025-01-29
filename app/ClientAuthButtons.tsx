"use client";
import { signIn, signOut } from "next-auth/react";

export default function ClientAuthButtons() {
  return (
    <>
      <button onClick={() => signIn("github")}>Sign In</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </>
  );
}
