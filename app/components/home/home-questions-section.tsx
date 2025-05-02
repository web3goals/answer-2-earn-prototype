import { Profile } from "@/types/profile";
import { Question } from "@/types/question";
import { CircleAlertIcon, PencilIcon } from "lucide-react";
import { Button } from "../ui/button";
import { HomeCover } from "./home-cover";
import { QuestionList } from "../questions/question-list";
import { HomeFooter } from "./home-footer";

export function HomeQuestionsSection(props: {
  profile: Profile;
  questions: Question[];
  onSectionChange: (section: "ASK" | "QUESTIONS" | "ANSWERS") => void;
  onQuestionsUpdate: () => void;
}) {
  return (
    <main className="container mx-auto px-4 py-4">
      <HomeCover
        profile={props.profile}
        title="YOUR QUESTIONS"
        description="Higher reward - higher visibility"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => props.onSectionChange("ANSWERS")}
            >
              <CircleAlertIcon /> Answers —{" "}
              {props.questions.filter((q) => q.reward.sent).length}
            </Button>
            <Button
              variant="secondary"
              onClick={() => props.onSectionChange("ASK")}
            >
              <PencilIcon /> Ask question
            </Button>
          </>
        }
      />
      <QuestionList
        profile={props.profile}
        questions={props.questions.filter((q) => !q.reward.sent)}
        onQuestionsUpdate={props.onQuestionsUpdate}
      />
      <HomeFooter />
    </main>
  );
}
