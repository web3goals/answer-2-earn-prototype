import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import { errorToString } from "@/lib/converters";
import { verifyLlmAnswer } from "@/lib/llm";
import { NextRequest } from "next/server";
import { z } from "zod";

const requestBodySchema = z.object({
  question: z.string().min(1),
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

    // Verify answer using LLM
    const verified = await verifyLlmAnswer(
      bodyParseResult.data.question,
      bodyParseResult.data.answer
    );

    // Return success response
    return createSuccessApiResponse(verified);
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
