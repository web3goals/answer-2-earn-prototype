import { Address } from "viem";

export type Metadata = {
  asker: Address;
  question: string;
  questionDate: number;
  reward: string;
  answerer: Address;
  answer?: string;
  answerDate?: number;
};
