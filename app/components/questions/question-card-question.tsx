import { Metadata } from "@/types/metadata";
import { Profile } from "@/types/profile";
import Image from "next/image";
import Link from "next/link";

export function QuestionCardQuestion(props: {
  questionMetadata: Metadata;
  askerProfile: Profile;
}) {
  const questionText = props.questionMetadata.attributes?.find(
    (attr) => attr.trait_type === "Question"
  )?.value;
  const questionDate = props.questionMetadata.attributes?.find(
    (attr) => attr.trait_type === "Question Date"
  )?.value;

  return (
    <div className="flex flex-row gap-4">
      {/* Left part */}
      <div className="size-16 rounded-full overflow-hidden">
        <Image
          src={props.askerProfile.image || "/images/user.png"}
          alt={`${props.askerProfile.name}'s profile picture`}
          width={96}
          height={96}
          className="w-full h-full"
        />
      </div>
      {/* Right part */}
      <div className="flex-1">
        <Link
          href={`https://universaleverything.io/${props.askerProfile.address}`}
          target="_blank"
        >
          <p className="text-primary font-semibold text-sm text">
            @{props.askerProfile.name}
          </p>
        </Link>
        <p className="text-muted-foreground text-sm">
          {new Date(questionDate as string).toLocaleString()}
        </p>
        <h4 className="text-xl font-semibold tracking-tight mt-1">
          {questionText}
        </h4>
      </div>
    </div>
  );
}
