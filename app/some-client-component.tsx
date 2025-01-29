"use client";

import { auth } from "@/auth";
import { StartupCardSkeleton } from "@/components/StartupCard";
import UserStartups from "@/components/UserStartups";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import { notFound } from "next/navigation";
import * as Sentry from "@sentry/nextjs";

export const experiment_ppr = true;

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const id = (await params).id;
    const session = await auth();

    const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
    if (!user) return notFound();

    return (
      <>
        <section className="profile_container">
          <div className="profile_card">
            <div className="profile_description">
              <h3 className="text-24-black uppercase text-center line-clamp-1">
                {user.name}
              </h3>
            </div>

            <Image
              src={user.image || "/default-image.png"}
              alt={user.name || "Default Alt Text"}
              width={220}
              height={220}
              className="profile_image"
            />

            <p className="text-30-extrabold mt-7 text-center">
              @{user?.username}
            </p>
            <p className="mt-1 text-center text-14-normal">{user?.bio}</p>
          </div>

          <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
            <p className="text-30-bold">
              {session?.id == id ? "Your" : "All"} Startups
            </p>
            <ul className="card_grid-sm">
              <UserStartupsWrapper id={id} />
            </ul>
          </div>
        </section>
      </>
    );
  } catch (error) {
    Sentry.captureException(error);
    return notFound();
  }
}
const UserStartupsWrapper = ({ id }: { id: string }) => {
  const [startups, setStartups] = useState<React.ReactNode>(
    <StartupCardSkeleton />
  );

  useEffect(() => {
    const fetchStartups = async () => {
      const result = await UserStartups({ id });
      setStartups(result);
    };

    fetchStartups();
  }, [id]);

  return <>{startups}</>;
};
