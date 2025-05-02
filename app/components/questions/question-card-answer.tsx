import { Metadata } from "@/types/metadata";
import { Profile } from "@/types/profile";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

export function QuestionCardAnswer(props: {
  profile: Profile;
  questionMetadata: Metadata;
}) {
  const answerText = props.questionMetadata.attributes?.find(
    (attr) => attr.trait_type === "Answer"
  )?.value;
  const answerDate = props.questionMetadata.attributes?.find(
    (attr) => attr.trait_type === "Answer Date"
  )?.value;

  if (!answerText || !answerDate) {
    return <></>;
  }

  return (
    <div>
      <Separator />
      <div className="flex flex-row gap-4 mt-4">
        {/* Left part */}
        <div className="size-10 rounded-full overflow-hidden">
          <Image
            src={props.profile.image || "/images/user.png"}
            alt={`${props.profile.name}'s profile picture`}
            width={96}
            height={96}
            className="w-full h-full"
          />
        </div>
        {/* Right part */}
        <div className="flex-1">
          <p className="text-muted-foreground text-sm">
            {new Date(answerDate as string).toLocaleString()}
          </p>
          <h4 className="text-xl mt-1">{answerText}</h4>
          <Badge variant="secondary" className="mt-2">
            <CheckIcon />
            <p>Answer verified by AI</p>
          </Badge>
        </div>
      </div>
    </div>
  );
}
