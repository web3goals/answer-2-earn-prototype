export function luksoIpfsToHttp(ipfs: string) {
  return ipfs.replace("ipfs://", "https://api.universalprofile.cloud/ipfs/");
}
