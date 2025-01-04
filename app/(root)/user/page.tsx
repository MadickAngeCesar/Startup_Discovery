import { redirect } from "next/navigation";
import { auth } from "@/auth"

export default async function UserPage() {
  const session = await auth()
  
  if (!session?.id) {
    redirect("/");
  }

  // Redirect to the user's profile page if they're logged in
  redirect(`/user/${session.id}`);
}
