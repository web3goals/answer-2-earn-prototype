import { questionAbi } from "@/abi/question";
import { chainConfig } from "@/config/chain";
import { pinataIpfsToHttp } from "@/lib/ipfs";
import { Metadata } from "@/types/metadata";
import ERC725 from "@erc725/erc725.js";
import axios from "axios";
import { createPublicClient, Hex, http } from "viem";

export async function getQuestionMetadata(questionId: Hex): Promise<Metadata> {
  // Load metadata value from the contract
  const publicClient = createPublicClient({
    chain: chainConfig.chain,
    transport: http(),
  });
  const metadataValue = await publicClient.readContract({
    address: chainConfig.contracts.question,
    abi: questionAbi,
    functionName: "getDataForTokenId",
    args: [
      questionId,
      "0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e",
    ],
  });

  // Decode metadata value to get the metadata URL
  const schema = [
    {
      name: "LSP4Metadata",
      key: "0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e",
      keyType: "Singleton",
      valueType: "bytes",
      valueContent: "VerifiableURI",
    },
  ];
  const erc725 = new ERC725(schema);
  const decodedMetadataValue = erc725.decodeData([
    {
      keyName: "LSP4Metadata",
      value: metadataValue,
    },
  ]);
  const metadataValueUrl = decodedMetadataValue[0]?.value?.url;

  // Define metadata HTTP URL
  const metadataHttpUrl = pinataIpfsToHttp(metadataValueUrl);
  if (!metadataHttpUrl) {
    throw new Error("Invalid metadata HTTP URL");
  }

  // Load metadata from IPFS
  const { data } = await axios.get(metadataHttpUrl);

  return data as Metadata;
}

export async function getEncodedQuestionMetadataValue(
  metadata: Metadata,
  metadataUrl: string
): Promise<Hex> {
  const schema = [
    {
      name: "LSP4Metadata",
      key: "0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e",
      keyType: "Singleton",
      valueType: "bytes",
      valueContent: "VerifiableURI",
    },
  ];
  const erc725 = new ERC725(schema);
  const encodedMetadata = erc725.encodeData([
    {
      keyName: "LSP4Metadata",
      value: {
        json: metadata,
        url: metadataUrl,
      },
    },
  ]);
  return encodedMetadata.values[0] as Hex;
}
