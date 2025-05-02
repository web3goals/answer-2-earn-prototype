import { Address } from "viem";

export type Profile = {
  address: Address;
  name: string;
  image?: string;
};
