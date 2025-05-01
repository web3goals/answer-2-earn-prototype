import useError from "@/hooks/use-error";
import { getQuestionMetadata } from "@/lib/metadata";
import { getProfile } from "@/lib/profile";
import { Metadata } from "@/types/metadata";
import { Profile } from "@/types/profile";
import { Question } from "@/types/question";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { Skeleton } from "../ui/skeleton";
import { QuestionCardQuestion } from "./question-card-question";
import { QuestionCardAnswerForm } from "./question-card-answer-form";
import { QuestionCardAnswer } from "./question-card-answer";

export function QuestionCard(props: {
  profile: Profile;
  question: Question;
  onQuestionUpdate: () => void;
}) {
  const { handleError } = useError();
  const [questionMetadata, setQuestionMetadata] = useState<
    Metadata | undefined
  >();
  const [askerProfile, setAskerProfile] = useState<Profile | undefined>();

  // Load question metadata
  useEffect(() => {
    getQuestionMetadata(props.question.id)
      .then((metadata) => {
        setQuestionMetadata(metadata);
      })
      .catch((error) => {
        handleError(error, "Failed to load question metadata, try again later");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.question]);

  // Load asker profile
  useEffect(() => {
    const askerAddress = questionMetadata?.attributes?.find(
      (attr) => attr.trait_type === "Asker"
    )?.value;
    if (askerAddress) {
      getProfile(askerAddress as Address)
        .then((profile) => setAskerProfile(profile))
        .catch((error) =>
          handleError(error, "Failed to load asker profile, try again later")
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionMetadata]);

  if (!questionMetadata || !askerProfile) {
    return <Skeleton className="w-full h-8" />;
  }

  return (
    <div className="w-full flex flex-col gap-4 border rounded-2xl p-4">
      <QuestionCardQuestion
        questionMetadata={questionMetadata}
        askerProfile={askerProfile}
      />
      <QuestionCardAnswerForm
        profile={props.profile}
        question={props.question}
        onAnswer={props.onQuestionUpdate}
      />
      <QuestionCardAnswer
        profile={props.profile}
        questionMetadata={questionMetadata}
      />
    </div>
  );
}
