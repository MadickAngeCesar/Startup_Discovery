"use client";

import { signIn, signOut } from "next-auth/react";
// ...existing imports...

export default function SomeClientComponent() {
  // ...existing code...
  return (
    <>
      <button onClick={() => signIn("github")}>Sign In</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </>
  );
}
