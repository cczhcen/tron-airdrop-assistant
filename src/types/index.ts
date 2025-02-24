export interface AddressGroup {
  _id: string;
  name: string;
  createdAt: string;
  addressCount?: number;
  addresses?: Address[];
}

export interface Address {
  _id?: string;
  group_id: string;
  address: string;
  description?: string;
}

export interface Airdrop {
  _id: string;
  tokenName: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
  fromAddress: string;
  contractAddress: string;
  totalAddresses: number;
  totalAmount: string;
  txHash: string;
  status: "pending" | "success" | "failed";
  details: AirdropDetail[];
  createdAt: string;
}

export interface AirdropDetail {
  address: string;
  amount: string;
}
