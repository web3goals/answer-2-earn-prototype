"use client";

import { questionAbi } from "@/abi/question";
import { HomeSection } from "@/components/home/home-section";
import { LoadingSection } from "@/components/loading-section";
import { chainConfig } from "@/config/chain";
import useError from "@/hooks/use-error";
import { useUpProvider } from "@/hooks/use-up-provider";
import { getProfile } from "@/lib/profile";
import { Profile } from "@/types/profile";
import { Question } from "@/types/question";
import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";

export default function HomePage() {
  const { handleError } = useError();
  const { contextAccounts } = useUpProvider();
  const [profile, setProfile] = useState<Profile | undefined>();
  const [questions, setQuestions] = useState<Question[] | undefined>();

  // Load questions for the current profile using the contract
  async function loadQuestions() {
    try {
      if (!profile) {
        return;
      }

      // Load tokens
      const publicClient = createPublicClient({
        chain: chainConfig.chain,
        transport: http(),
      });
      const tokens = await publicClient.readContract({
        address: chainConfig.contracts.question,
        abi: questionAbi,
        functionName: "tokenIdsOf",
        args: [profile.address],
      });

      // Load token rewards and create questions
      const questions: Question[] = [];
      for (const token of tokens) {
        const reward = await publicClient.readContract({
          address: chainConfig.contracts.question,
          abi: questionAbi,
          functionName: "getReward",
          args: [token],
        });
        questions.push({
          id: token,
          reward: {
            value: reward.value,
            sent: reward.sent,
          },
        });
      }

      setQuestions(questions);
    } catch (error) {
      handleError(error, "Failed to load questions, try again later");
    }
  }

  // Load profile on context account change
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

  // Load questions on profile change
  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  if (profile && questions) {
    return (
      <HomeSection
        profile={profile}
        questions={questions}
        onQuestionsUpdate={() => loadQuestions()}
      />
    );
  }

  return <LoadingSection />;
}
