import { Hex } from "viem";

export type Question = {
  id: Hex;
  reward: {
    value: bigint;
    sent: boolean;
  };
};
