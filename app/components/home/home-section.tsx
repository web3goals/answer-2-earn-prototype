import { Profile } from "@/types/profile";
import { Question } from "@/types/question";
import { useState } from "react";
import { HomeAnswersSection } from "./home-answers-section";
import { HomeAskSection } from "./home-ask-section";
import { HomeQuestionsSection } from "./home-questions-section";

export function HomeSection(props: {
  profile: Profile;
  questions: Question[];
  onQuestionsUpdate: () => void;
}) {
  const [section, setSection] = useState<"ASK" | "QUESTIONS" | "ANSWERS">(
    "ASK"
  );

  if (section === "QUESTIONS") {
    return (
      <HomeQuestionsSection
        profile={props.profile}
        questions={props.questions}
        onSectionChange={setSection}
        onQuestionsUpdate={props.onQuestionsUpdate}
      />
    );
  }

  if (section === "ANSWERS") {
    return (
      <HomeAnswersSection
        profile={props.profile}
        questions={props.questions}
        onSectionChange={setSection}
        onQuestionsUpdate={props.onQuestionsUpdate}
      />
    );
  }

  return (
    <HomeAskSection
      profile={props.profile}
      questions={props.questions}
      onSectionChange={setSection}
      onAsk={props.onQuestionsUpdate}
    />
  );
}
