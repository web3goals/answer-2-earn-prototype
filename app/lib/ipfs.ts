export function pinataIpfsToHttp(ipfs: string): string {
  return ipfs.replace(
    "ipfs://",
    "https://yellow-mute-echidna-168.mypinata.cloud/ipfs/"
  );
}

export function luksoIpfsToHttp(ipfs: string): string {
  return ipfs.replace("ipfs://", "https://api.universalprofile.cloud/ipfs/");
}
