import { useState } from "react";
import { HomeAnswersSection } from "./home-answers-section";
import { HomeAskSection } from "./home-ask-section";
import { HomeQuestionsSection } from "./home-questions-section";
import { Profile } from "@/types/profile";

export function HomeSection(props: { profile: Profile }) {
  const [section, setSection] = useState<"ASK" | "QUESTIONS" | "ANSWERS">(
    "ASK"
  );

  if (section === "QUESTIONS") {
    return (
      <HomeQuestionsSection
        profile={props.profile}
        onSectionChange={setSection}
      />
    );
  }

  if (section === "ANSWERS") {
    return (
      <HomeAnswersSection
        profile={props.profile}
        onSectionChange={setSection}
      />
    );
  }

  return (
    <HomeAskSection profile={props.profile} onSectionChange={setSection} />
  );
}
