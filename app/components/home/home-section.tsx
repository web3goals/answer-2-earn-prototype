import { useState } from "react";
import { HomeAnswersSection } from "./home-answers-section";
import { HomeAskSection } from "./home-ask-section";
import { HomeQuestionsSection } from "./home-questions-section";

export function HomeSection() {
  const [section, setSection] = useState<"ASK" | "QUESTIONS" | "ANSWERS">(
    "ASK"
  );

  if (section === "QUESTIONS") {
    return <HomeQuestionsSection />;
  } else if (section === "ANSWERS") {
    return <HomeAnswersSection />;
  } else {
    return <HomeAskSection />;
  }
}
