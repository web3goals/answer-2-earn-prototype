import useError from "@/hooks/use-error";
import { useUpProvider } from "@/hooks/use-up-provider";
import { getQuestionMetadata } from "@/lib/metadata";
import { getProfile } from "@/lib/profile";
import { Metadata } from "@/types/metadata";
import { Profile } from "@/types/profile";
import { Question } from "@/types/question";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Address } from "viem";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export function HomeQuestionCard(props: {
  profile: Profile;
  question: Question;
  onQuestionUpdate: () => void;
}) {
  const { handleError } = useError();
  const [questionMetadata, setQuestionMetadata] = useState<
    Metadata | undefined
  >();
  const [askerProfile, setAskerProfile] = useState<Profile | undefined>();

  // Load question metadata
  useEffect(() => {
    getQuestionMetadata(props.question.id)
      .then((metadata) => {
        setQuestionMetadata(metadata);
      })
      .catch((error) => {
        handleError(error, "Failed to load question metadata, try again later");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.question]);

  // Load asker profile
  useEffect(() => {
    const askerAddress = questionMetadata?.attributes?.find(
      (attr) => attr.trait_type === "Asker"
    )?.value;
    if (askerAddress) {
      getProfile(askerAddress as Address)
        .then((profile) => setAskerProfile(profile))
        .catch((error) =>
          handleError(error, "Failed to load asker profile, try again later")
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionMetadata]);

  if (!questionMetadata || !askerProfile) {
    return <Skeleton className="w-full h-8" />;
  }

  return (
    <div className="w-full flex flex-col gap-4 border rounded-2xl p-4">
      <HomeQuestionCardQuestion
        questionMetadata={questionMetadata}
        askerProfile={askerProfile}
      />
      <HomeQuestionCardAnswerForm
        profile={props.profile}
        question={props.question}
        onAnswer={props.onQuestionUpdate}
      />
      <HomeQuestionCardAnswer
        profile={props.profile}
        questionMetadata={questionMetadata}
      />
    </div>
  );
}

function HomeQuestionCardQuestion(props: {
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
          src={props.askerProfile.image}
          alt={`${props.askerProfile.name}'s profile picture`}
          width={96}
          height={96}
          className="w-full h-full"
        />
      </div>
      {/* Right part */}
      <div className="flex-1">
        <Link
          href={`https://universaleverything.io/${props.askerProfile.address}?network=testnet`}
          target="_blank"
        >
          <p className="text-primary font-semibold text-sm text">
            @{props.askerProfile.name}
          </p>
        </Link>
        <p className="text-muted-foreground text-sm">
          {new Date(questionDate as string).toLocaleString()}
        </p>
        <h4 className="text-xl tracking-tight mt-1">{questionText}</h4>
      </div>
    </div>
  );
}

// TODO:
function HomeQuestionCardAnswerForm(props: {
  profile: Profile;
  question: Question;
  onAnswer: () => void;
}) {
  const { accounts } = useUpProvider();
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);

  const formSchema = z.object({
    answer: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsProsessing(true);

      // Send answer to the server
      await axios.post("/api/answer", {
        id: props.question.id,
        answer: values.answer,
      });

      form.reset();
      props.onAnswer();
      toast("Answer verified and posted 🎉");
    } catch (error) {
      if (error instanceof AxiosError && error.status === 422) {
        toast.error(
          "Failed to verify answer with AI, please try another answer"
        );
      } else {
        handleError(error, "Failed to submit the form, try again later");
      }
    } finally {
      setIsProsessing(false);
    }
  }

  if (props.question.reward.sent) {
    return <></>;
  }

  if (accounts[0] !== props.profile.address) {
    return <></>;
  }

  return (
    <div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 mt-4"
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Answer *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="My dream is..."
                    disabled={isProsessing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="default" disabled={isProsessing}>
            {isProsessing ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <ArrowRightIcon />
            )}
            Post and verify answer with AI
          </Button>
        </form>
      </Form>
    </div>
  );
}

// TODO:
function HomeQuestionCardAnswer(props: {
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
      <div>{props.profile.image}</div>
      <div>{answerDate}</div>
      <div>{answerText}</div>
    </div>
  );
}
