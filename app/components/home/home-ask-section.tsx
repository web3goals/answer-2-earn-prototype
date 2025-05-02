import { Profile } from "@/types/profile";
import { Question } from "@/types/question";
import { CircleAlertIcon, CircleHelpIcon } from "lucide-react";
import { QuestionAskForm } from "../questions/question-ask-form";
import { Button } from "../ui/button";
import { HomeCover } from "./home-cover";
import { HomeFooter } from "./home-footer";

export function HomeAskSection(props: {
  profile: Profile;
  questions: Question[];
  onSectionChange: (section: "ASK" | "QUESTIONS" | "ANSWERS") => void;
  onAsk: () => void;
}) {
  return (
    <main className="container mx-auto px-4 py-4">
      <HomeCover
        profile={props.profile}
        title="ASK ME ANYTHING"
        description="Higher reward - higher visibility"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => props.onSectionChange("QUESTIONS")}
            >
              <CircleHelpIcon /> Questions —{" "}
              {props.questions.filter((q) => !q.reward.sent).length}
            </Button>
            <Button
              variant="secondary"
              onClick={() => props.onSectionChange("ANSWERS")}
            >
              <CircleAlertIcon /> Answers —{" "}
              {props.questions.filter((q) => q.reward.sent).length}
            </Button>
          </>
        }
      />
      <QuestionAskForm profile={props.profile} onAsk={props.onAsk} />
      <HomeFooter />
    </main>
  );
}
