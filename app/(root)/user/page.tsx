import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"

export default async function UserPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.id) {
    redirect("/");
  }

  // Redirect to the user's profile page if they're logged in
  redirect(`/user/${session.id}`);
}
