import React from "react";
import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

import markdownit from "markdown-it";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";

const md = markdownit();

export const experimental_ppr = true;

async function deleteStartup(id: string) {
  "use server";
  try {
    await writeClient.delete(id);
    redirect("/");
  } catch (error) {
    console.error("Error deleting startup:", error);
    throw new Error("Failed to delete startup");
  }
}

interface PageProps {
  params: {
    id: string;
  };
}

const page = async ({ params }: PageProps) => {
  const session = await auth();
  const [post, editorPosts] = await Promise.all([
    client.fetch(STARTUP_BY_ID_QUERY, { id: params.id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "editor-picks-new" }),
  ]);
  
  if (!post) return notFound();

  const parsedContent = md.render(post?.pitch || "");
  const isAuthor = session?.id === post.author?._id;

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
        <div className="flex items-center gap-4">
          <Link href={post.preview} target="_blank" rel="noopener noreferrer">
            <button className="redirect-btn">
              Download from GitHub Release
            </button>
          </Link>

          {isAuthor && (
            <div className="flex items-center gap-2">
              <Link href={`/startup/${params.id}/edit`}>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <form action={deleteStartup.bind(null, params.id)}>
                <Button variant="destructive" size="icon" type="submit">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </section>

      <section className="section_container">
        <Image
          src={post.image || "/default-image.jpg"}
          alt="thumbnail"
          width={800}
          height={600}
          className="w-full h-auto rounded-xl"
        />
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post.author?.image || "/vercel.svg"}
                alt="author"
                width={50}
                height={50}
                className="rounded-full drop-shadow-lg"
              />
              <div>
                <p className="text-20-medium">{post.author?.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post.author?.username}
                </p>
              </div>
            </Link>

            <p className="category-tag">{post.category}</p>
          </div>

          <h3 className="text-30-bold">Pitch Detail</h3>
          {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p>No details provided</p>
          )}
        </div>

        <hr className="divider" />

        {editorPosts?.select && editorPosts.select.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Editor Picks</p>

            <ul className="mt-7 card_grid-sm">
              {editorPosts.select.map((post) => (
                <StartupCard key={post._id} post={post as StartupTypeCard} />
              ))}
            </ul>
          </div>
        )}

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={params.id} />
        </Suspense>
      </section>
    </>
  );
};

export default page;
