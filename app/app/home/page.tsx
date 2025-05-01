"use client";

import { HomeSection } from "@/components/home/home-section";
import { LoadingSection } from "@/components/loading-section";
import { useUpProvider } from "@/hooks/use-up-provider";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { contextAccounts, accounts, chainId } = useUpProvider();
  const [profile, setProfile] = useState<unknown | undefined>(undefined);
  const [questions, setQuestions] = useState<unknown[] | undefined>([]);

  // Load profile metadata and questions
  useEffect(() => {}, [contextAccounts]);

  if (profile && questions) {
    return <HomeSection />;
  }

  return <LoadingSection />;
}
