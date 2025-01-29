import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function UserPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  if (!session.id) {
    throw new Error("No user ID found in session");
  }

  redirect(`/user/${session.id}`);
}
