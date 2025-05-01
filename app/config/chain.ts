import { Address } from "viem";
import { luksoTestnet } from "viem/chains";

export const chainConfig = {
  chain: luksoTestnet,
  contracts: {
    question: "0xf81abf7d2d09369cda771f4b432ef01e75576759" as Address,
  },
};
