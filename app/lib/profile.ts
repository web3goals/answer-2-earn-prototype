import { profileAbi } from "@/abi/profile";
import { chainConfig } from "@/config/chain";
import { Profile } from "@/types/profile";
import ERC725 from "@erc725/erc725.js";
import axios from "axios";
import { Address, createPublicClient, http } from "viem";
import { luksoIpfsToHttp } from "./ipfs";

export async function getProfile(
  address: Address
): Promise<Profile | undefined> {
  // Load profile value from the contract
  const publicClient = createPublicClient({
    chain: chainConfig.chain,
    transport: http(),
  });

  const profileValue = await publicClient.readContract({
    address: address,
    abi: profileAbi,
    functionName: "getData",
    args: [
      "0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5",
    ],
  });

  // Decode profile value to get the profile URL
  const schema = [
    {
      name: "LSP3Profile",
      key: "0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5",
      keyType: "Singleton",
      valueType: "bytes",
      valueContent: "VerifiableURI",
    },
  ];
  const erc725 = new ERC725(schema);
  const decodedProfileValue = erc725.decodeData([
    {
      keyName: "LSP3Profile",
      value: profileValue,
    },
  ]);
  const profileValueUrl = decodedProfileValue[0]?.value?.url;

  // Return anonymous profile if no URL is found
  if (!profileValueUrl) {
    return {
      address: address,
      name: "anonymous",
    };
  }

  // Define profile HTTP URL
  const profileHttpUrl = luksoIpfsToHttp(profileValueUrl);
  if (!profileHttpUrl) {
    throw new Error("Invalid profile HTTP URL");
  }

  // Load profile from IPFS
  const { data } = await axios.get(profileHttpUrl);

  // Create a profile object
  const profile: Profile = {
    address: address,
    name: data.LSP3Profile?.name || "Uknown",
    image: luksoIpfsToHttp(data.LSP3Profile?.profileImage?.[0]?.url),
  };

  return profile;
}
