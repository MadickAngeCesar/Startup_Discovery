import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function UserPage() {
  const session = await auth();
  if (!session?.id) redirect("/");
  redirect(`/user/${session.id}`);
}
