import { Profile } from "@/types/profile";
import { ERC725 } from "@erc725/erc725.js";
import profileSchemas from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json";
import { Address } from "viem";
import { luksoIpfsToHttp } from "./ipfs";

export async function getProfile(
  address: Address
): Promise<Profile | undefined> {
  const erc725 = new ERC725(
    profileSchemas,
    address,
    "https://rpc.testnet.lukso.network",
    {
      ipfsGateway: "https://api.universalprofile.cloud/ipfs/",
    }
  );
  const data = await erc725.fetchData("LSP3Profile");
  if (
    data.value &&
    typeof data.value === "object" &&
    "LSP3Profile" in data.value
  ) {
    return {
      address: address,
      name: data.value.LSP3Profile.name,
      image: luksoIpfsToHttp(data.value.LSP3Profile.profileImage[0].url),
    };
  }
  return undefined;
}
