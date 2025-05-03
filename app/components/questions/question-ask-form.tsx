import { questionAbi } from "@/abi/question";
import { chainConfig } from "@/config/chain";
import { siteConfig } from "@/config/site";
import useError from "@/hooks/use-error";
import { useUpProvider } from "@/hooks/use-up-provider";
import { getEncodedQuestionMetadataValue } from "@/lib/metadata";
import { Metadata } from "@/types/metadata";
import { Profile } from "@/types/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createPublicClient, http, parseEther } from "viem";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export function QuestionAskForm(props: {
  profile: Profile;
  onAsk: () => void;
}) {
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);
  const { client, accounts, walletConnected } = useUpProvider();

  const formSchema = z.object({
    question: z.string().min(1),
    reward: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      reward: "0.01",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsProsessing(true);

      // Check if the user is connected to the wallet and the correct network
      if (!client || !walletConnected) {
        toast.warning("Please connect your wallet first");
        return;
      }
      if (client.chain?.id !== chainConfig.chain.id) {
        toast.warning(
          `Please switch to ${chainConfig.chain.name} network first`
        );
        return;
      }

      // Create metadata
      const metadata: Metadata = {
        name: "Question Token",
        description: "A token issued by the Answer 2 Earn project",
        external_url: siteConfig.links.github,
        image:
          "ipfs://bafkreiahpktywfs64j6fpdu7cyl4yifj4ivxvudge3zuv7sga6qh3x7h74",
        attributes: [
          {
            trait_type: "Asker",
            value: accounts[0],
          },
          {
            trait_type: "Question",
            value: values.question,
          },
          {
            trait_type: "Question Date",
            value: new Date().getTime(),
          },
          {
            trait_type: "Reward",
            value: parseEther(values.reward).toString(),
          },
          {
            trait_type: "Answerer",
            value: props.profile.address,
          },
        ],
      };

      // Upload metadata to IPFS
      const { data } = await axios.post("/api/ipfs", {
        data: JSON.stringify(metadata),
      });
      const metadataUrl = data.data;

      // Encode metadata to get the metadata value
      const encodedMetadataValue = await getEncodedQuestionMetadataValue(
        metadata,
        metadataUrl
      );

      // Ask the question by calling the smart contract
      const publicClient = createPublicClient({
        chain: chainConfig.chain,
        transport: http(),
      });
      const { request } = await publicClient.simulateContract({
        account: accounts[0],
        address: chainConfig.contracts.question,
        abi: questionAbi,
        functionName: "ask",
        args: [props.profile.address, encodedMetadataValue],
        value: parseEther(values.reward),
      });
      const hash = await client.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      form.reset();
      props.onAsk();
      toast("Question posted 🎉");
    } catch (error) {
      handleError(error, "Failed to submit the form, try again later");
    } finally {
      setIsProsessing(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 mt-8"
      >
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What’s your dream?"
                  disabled={isProsessing}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reward"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reward *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isProsessing}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reward" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0.01">
                    🪙 — 0.01 {chainConfig.chain.nativeCurrency.symbol}
                  </SelectItem>
                  <SelectItem value="0.05">
                    💰 — 0.05 {chainConfig.chain.nativeCurrency.symbol}
                  </SelectItem>
                  <SelectItem value="0.1">
                    💎 — 0.1 {chainConfig.chain.nativeCurrency.symbol}
                  </SelectItem>
                </SelectContent>
              </Select>
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
          Ask
        </Button>
      </form>
    </Form>
  );
}
