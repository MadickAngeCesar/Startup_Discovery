"use client";

import { useEffect, useState } from "react";
import { StartupCardSkeleton } from "@/components/StartupCard";
import UserStartups from "@/components/UserStartups";

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

export default UserStartupsWrapper;
