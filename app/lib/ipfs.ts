export function pinataIpfsToHttp(ipfs: string | undefined): string | undefined {
  return ipfs?.replace(
    "ipfs://",
    "https://yellow-mute-echidna-168.mypinata.cloud/ipfs/"
  );
}

export function luksoIpfsToHttp(ipfs: string | undefined): string | undefined {
  return ipfs?.replace("ipfs://", "https://api.universalprofile.cloud/ipfs/");
}
