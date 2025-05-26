import { Address } from "viem";
import { lukso } from "viem/chains";

export const chainConfig = {
  chain: lukso,
  contracts: {
    question: "0xf81abf7d2d09369cda771f4b432ef01e75576759" as Address,
  },
};
