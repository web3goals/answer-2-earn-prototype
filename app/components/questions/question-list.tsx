import { Question } from "@/types/question";
import { parseEther } from "viem";
import EntityList from "../entity-list";
import { QuestionCard } from "./question-card";
import { Profile } from "@/types/profile";

export function QuestionList(props: {
  profile: Profile;
  questions: Question[];
  onQuestionsUpdate: () => void;
}) {
  const groups = [
    {
      title: "💎 — 0.1 LYX",
      questions: props.questions
        .filter((q) => q.reward.value === parseEther("0.1"))
        .reverse(),
    },
    {
      title: "💰 — 0.05 LYX",
      questions: props.questions
        .filter((q) => q.reward.value === parseEther("0.05"))
        .reverse(),
    },
    {
      title: "🪙 — 0.01 LYX",
      questions: props.questions
        .filter((q) => q.reward.value === parseEther("0.01"))
        .reverse(),
    },
  ];

  return (
    <div className="flex flex-col items-center gap-12 mt-12">
      {groups.map((group, index) => (
        <div key={index} className="w-full flex flex-col gap-2">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-2">
            {group.title}
          </h2>
          <EntityList<Question>
            entities={group.questions}
            renderEntityCard={(question, i) => (
              <QuestionCard
                key={i}
                profile={props.profile}
                question={question}
                onQuestionUpdate={props.onQuestionsUpdate}
              />
            )}
            noEntitiesText="No questions with such a reward yet..."
          />
        </div>
      ))}
    </div>
  );
}
