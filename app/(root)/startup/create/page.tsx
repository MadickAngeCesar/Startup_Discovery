import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"
import StartupForm from "@/components/StartupForm";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

const page = async () => {
  try {
    const session = await getServerSession(authOptions)
    if(!session) redirect("/");
    
    return (
      <>
        <section className="pink_container !min-h-[230px]">
          <h1 className="heading">Submit Your Startup</h1>
        </section>

        <Suspense fallback={<div>Loading form...</div>}>
          <StartupForm />
        </Suspense>
      </>
    );
  } catch (error) {
    console.error("Error in create page:", error);
    throw new Error("Failed to load create page");
  }
};

export default page;
