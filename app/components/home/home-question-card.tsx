import { useUpProvider } from "@/hooks/use-up-provider";
import { Metadata } from "@/types/metadata";
import { Profile } from "@/types/profile";
import { Question } from "@/types/question";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { Address, createPublicClient, http } from "viem";
import { chainConfig } from "@/config/chain";
import { questionAbi } from "@/abi/question";
import useError from "@/hooks/use-error";
import { getProfile } from "@/lib/profile";
import ERC725 from "@erc725/erc725.js";
import axios from "axios";
import { pinataIpfsToHttp } from "@/lib/ipfs";
import Link from "next/link";

export function HomeQuestionCard(props: {
  profile: Profile;
  question: Question;
}) {
  const { handleError } = useError();
  const [questionMetadata, setQuestionMetadata] = useState<
    Metadata | undefined
  >();
  const [askerProfile, setAskerProfile] = useState<Profile | undefined>();

  async function loadQuestionMetadata() {
    try {
      // Load metadata value from the contract
      const publicClient = createPublicClient({
        chain: chainConfig.chain,
        transport: http(),
      });
      const metadataValue = await publicClient.readContract({
        address: chainConfig.contracts.question,
        abi: questionAbi,
        functionName: "getDataForTokenId",
        args: [
          props.question.id,
          "0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e",
        ],
      });

      // Decode metadata value to get the metadata URL
      const schema = [
        {
          name: "LSP4Metadata",
          key: "0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e",
          keyType: "Singleton",
          valueType: "bytes",
          valueContent: "VerifiableURI",
        },
      ];
      const erc725 = new ERC725(schema);
      const decodedMetadataValue = erc725.decodeData([
        {
          keyName: "LSP4Metadata",
          value: metadataValue,
        },
      ]);
      const metadataValueUrl = decodedMetadataValue[0]?.value?.url;

      // Load metadata from IPFS
      const { data } = await axios.get(pinataIpfsToHttp(metadataValueUrl));
      setQuestionMetadata(data);
    } catch (error) {
      handleError(error, "Failed to load question metadata, try again later");
    }
  }

  useEffect(() => {
    loadQuestionMetadata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.question]);

  useEffect(() => {
    const questionAsker = questionMetadata?.attributes?.find(
      (attr) => attr.trait_type === "Asker"
    )?.value;
    if (questionAsker) {
      getProfile(questionAsker as Address)
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
}) {
  const { accounts } = useUpProvider();

  if (props.question.reward.sent) {
    return <></>;
  }

  if (accounts[0] !== props.profile.address) {
    return <></>;
  }

  return (
    <div>
      <Separator />
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
