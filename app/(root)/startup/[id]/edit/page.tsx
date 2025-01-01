import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound, redirect } from "next/navigation";
import StartupEditForm from "@/components/StartupEditForm";

export const experimental_ppr = true;

const page = async ({ params }: { params: { id: string } }) => {
  try {
    const session = await auth();
    if (!session) redirect("/");

    const post = await client.fetch(STARTUP_BY_ID_QUERY, { id: params.id });

    if (!post) return notFound();
    if (session.id !== post.author?._id) redirect("/");

    return (
      <>
        <section className="pink_container !min-h-[230px]">
          <h1 className="heading">Edit Your Startup</h1>
        </section>

        <StartupEditForm post={post} />
      </>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
};

export default page;