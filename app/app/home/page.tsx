"use client";

import { HomeSection } from "@/components/home/home-section";
import { LoadingSection } from "@/components/loading-section";
import useError from "@/hooks/use-error";
import { useUpProvider } from "@/hooks/use-up-provider";
import { getProfile } from "@/lib/profile";
import { Profile } from "@/types/profile";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { handleError } = useError();
  const { contextAccounts } = useUpProvider();
  const [profile, setProfile] = useState<Profile | undefined>();
  const [questions, setQuestions] = useState<unknown[] | undefined>();

  // Load profile using ERC725
  useEffect(() => {
    if (contextAccounts && contextAccounts.length > 0) {
      getProfile(contextAccounts[0])
        .then((profile) => setProfile(profile))
        .catch((error) =>
          handleError(error, "Failed to load profile, try again later")
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextAccounts]);

  // Load questions using smart contract
  // TODO:
  useEffect(() => {
    if (profile) {
      setQuestions([]);
    }
  }, [profile]);

  if (profile && questions) {
    return <HomeSection profile={profile} />;
  }

  return <LoadingSection />;
}
