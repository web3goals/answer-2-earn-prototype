import { chainConfig } from "@/config/chain";
import useError from "@/hooks/use-error";
import { useUpProvider } from "@/hooks/use-up-provider";
import { Profile } from "@/types/profile";
import { Question } from "@/types/question";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

export function QuestionCardAnswerForm(props: {
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
      const { data } = await axios.post("/api/answer", {
        id: props.question.id,
        answer: values.answer,
      });

      form.reset();
      props.onAnswer();
      toast("Answer verified and posted 🎉", {
        action: {
          label: "Transaction",
          onClick: () => {
            window.open(
              chainConfig.chain.blockExplorers.default.url + "/tx/" + data.data,
              "_blank"
            );
          },
        },
      });
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
                  <Textarea
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
