import { Profile } from "@/types/profile";
import Image from "next/image";

export function HomeCover(props: {
  profile: Profile;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="bg-primary flex flex-col items-center p-8 rounded-2xl">
      <div className="size-32 rounded-full overflow-hidden">
        <Image
          src={props.profile.image || "/images/user.png"}
          alt={`${props.profile.name}'s profile picture`}
          width={96}
          height={96}
          className="w-full h-full"
        />
      </div>
      <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-center text-primary-foreground mt-4">
        {props.title}
      </h1>
      <p className="text-center text-primary-foreground mt-1">
        {props.description}
      </p>
      <div className="flex flex-row items-center gap-2 mt-8">
        {props.actions}
      </div>
    </div>
  );
}
