import { Address } from "viem";

export const CONTRACTS: {
  [key: string]: {
    question: Address | undefined;
  };
} = {
  luksoTestnet: {
    question: "0xf81abf7d2d09369cda771f4b432ef01e75576759",
  },
};
