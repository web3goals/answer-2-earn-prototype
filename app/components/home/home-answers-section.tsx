import { Profile } from "@/types/profile";
import { CircleHelpIcon, PencilIcon } from "lucide-react";
import { Button } from "../ui/button";
import { HomeCover } from "./home-cover";

// TODO: Display counters
export function HomeAnswersSection(props: {
  profile: Profile;
  onSectionChange: (section: "ASK" | "QUESTIONS" | "ANSWERS") => void;
}) {
  return (
    <main className="container mx-auto px-4 py-4">
      <HomeCover
        profile={props.profile}
        title="YOUR ANSWERS"
        description="Higher reward - higher visibility"
      >
        <div className="flex flex-row items-center gap-4">
          <Button
            variant="secondary"
            onClick={() => props.onSectionChange("QUESTIONS")}
          >
            <CircleHelpIcon /> Questions (X)
          </Button>
          <Button
            variant="secondary"
            onClick={() => props.onSectionChange("ASK")}
          >
            <PencilIcon /> Ask question
          </Button>
        </div>
      </HomeCover>
    </main>
  );
}
