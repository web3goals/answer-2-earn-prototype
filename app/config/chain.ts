import { Address } from "viem";
import { luksoTestnet } from "viem/chains";

export const chainConfig = {
  chain: luksoTestnet,
  contracts: {
    question: "0x4eca13c538d53b9adecf872c66a4db6ff98b0074" as Address,
  },
};
