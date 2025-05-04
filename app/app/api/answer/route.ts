import { questionAbi } from "@/abi/question";
import { chainConfig } from "@/config/chain";
import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import { errorToString } from "@/lib/converters";
import { verifyLlmAnswer } from "@/lib/llm";
import {
  getEncodedQuestionMetadataValue,
  getQuestionMetadata,
} from "@/lib/metadata";
import { NextRequest } from "next/server";
import { PinataSDK } from "pinata";
import { createPublicClient, createWalletClient, Hex, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { z } from "zod";

const requestBodySchema = z.object({
  id: z.string().min(1),
  answer: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    // Get and parse request data
    const body = await request.json();
    const bodyParseResult = requestBodySchema.safeParse(body);
    if (!bodyParseResult.success) {
      return createFailedApiResponse(
        {
          message: `Request body invalid: ${JSON.stringify(bodyParseResult)}`,
        },
        400
      );
    }

    // Get metadata and question
    const metadata = await getQuestionMetadata(bodyParseResult.data.id as Hex);
    const question = metadata.attributes?.find(
      (attr) => attr.trait_type === "Question"
    )?.value;
    if (!question) {
      return createFailedApiResponse(
        { message: "Question not found in metadata" },
        404
      );
    }

    // Verify answer using LLM
    const verified = await verifyLlmAnswer(
      question as string,
      bodyParseResult.data.answer
    );
    if (!verified) {
      return createFailedApiResponse(
        { message: "Failed to verify answer with AI" },
        422
      );
    }

    // Update metadata with the answer
    metadata.attributes = [
      ...(metadata.attributes || []),
      ...[
        {
          trait_type: "Answer",
          value: bodyParseResult.data.answer,
        },
        {
          trait_type: "Answer Date",
          value: new Date().getTime(),
        },
      ],
    ];

    // Upload metadata to IPFS
    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT,
      pinataGateway: "https://yellow-mute-echidna-168.mypinata.cloud/ipfs/",
    });
    const upload = await pinata.upload.public.json(metadata);
    const metadataUrl = `ipfs://${upload.cid}`;

    // Encode metadata to get the metadata value
    const encodedMetadataValue = await getEncodedQuestionMetadataValue(
      metadata,
      metadataUrl
    );

    // Answer the question using the contract
    const account = privateKeyToAccount(process.env.ACCOUNT_PRIVATE_KEY as Hex);
    const publicClient = createPublicClient({
      chain: chainConfig.chain,
      transport: http(),
    });
    const walletClient = createWalletClient({
      account: account,
      chain: chainConfig.chain,
      transport: http(),
    });
    const { request: answerRequest } = await publicClient.simulateContract({
      account: account,
      address: chainConfig.contracts.question,
      abi: questionAbi,
      functionName: "answer",
      args: [bodyParseResult.data.id as Hex, encodedMetadataValue],
    });
    const hash = await walletClient.writeContract(answerRequest);
    await publicClient.waitForTransactionReceipt({ hash });

    // Return success response
    return createSuccessApiResponse(hash);
  } catch (error) {
    console.error(
      `Failed to process ${request.method} request for "${
        new URL(request.url).pathname
      }":`,
      errorToString(error)
    );
    return createFailedApiResponse(
      { message: "Internal server error, try again later" },
      500
    );
  }
}
