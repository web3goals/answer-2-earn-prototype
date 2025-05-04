import { promptConfig } from "@/config/prompts";
import { HumanMessage } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

function getGoogleLlm(): ChatGoogleGenerativeAI {
  return new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-preview-04-17",
    apiKey: process.env.GOOGLE_API_KEY,
    maxRetries: 2,
  });
}

export async function verifyLlmAnswer(
  question: string,
  answer: string
): Promise<boolean> {
  // Define prompt
  const template = PromptTemplate.fromTemplate(
    promptConfig.promptTemplateVerifyAnswer
  );
  const prompt = (await template.invoke({ question, answer })).value;

  // Call LLM
  const llm = getGoogleLlm();
  const response = await llm.invoke([new HumanMessage(prompt)]);
  if (typeof response.content !== "string") {
    throw new Error("Unsupported response content type");
  }
  return response.content.trim().toUpperCase() === "TRUE";
}
