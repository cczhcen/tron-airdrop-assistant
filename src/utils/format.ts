// Author: segon
// GitHub: https://github.com/segonse/segonse
// This file is for tron airdrop

export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
