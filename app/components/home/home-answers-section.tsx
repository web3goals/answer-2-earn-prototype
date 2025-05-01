import { Profile } from "@/types/profile";
import { CircleHelpIcon, PencilIcon } from "lucide-react";
import { Button } from "../ui/button";
import { HomeCover } from "./home-cover";
import { Question } from "@/types/question";

export function HomeAnswersSection(props: {
  profile: Profile;
  questions: Question[];
  onSectionChange: (section: "ASK" | "QUESTIONS" | "ANSWERS") => void;
}) {
  return (
    <main className="container mx-auto px-4 py-4">
      <HomeCover
        profile={props.profile}
        title="YOUR ANSWERS"
        description="Higher reward - higher visibility"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => props.onSectionChange("QUESTIONS")}
            >
              <CircleHelpIcon /> Questions — {props.questions.length}
            </Button>
            <Button
              variant="secondary"
              onClick={() => props.onSectionChange("ASK")}
            >
              <PencilIcon /> Ask question
            </Button>
          </>
        }
      ></HomeCover>
    </main>
  );
}
