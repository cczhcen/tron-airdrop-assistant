interface TronContractMethod {
  call: () => Promise<unknown>;
  send: (options?: { from: string; value?: number }) => Promise<unknown>;
}

interface TronContract {
  at(address: string): Promise<TronContract>;
  methods: Record<string, (...args: unknown[]) => TronContractMethod>;
  name(): { call(): Promise<string> };
  symbol(): { call(): Promise<string> };
  decimals(): { call(): Promise<number> };
  balanceOf(address: string): { call(): Promise<string> };
  allowance(owner: string, spender: string): { call(): Promise<string> };
  approve(
    spender: string,
    amount: string
  ): {
    send(options: { feeLimit: number }): Promise<string>;
  };
  batchTransferTokenSimple(
    token: string,
    addresses: string[],
    amounts: string[]
  ): {
    send(options: { feeLimit: number }): Promise<string>;
  };
}

interface TronLinkWallet {
  request(args: { method: string }): Promise<void>;
  tronWeb: {
    defaultAddress: {
      base58: string;
    };
    contract: TronContract;
  };
}

interface TronWeb {
  request: (options: {
    method: string;
  }) => Promise<{ code: number; message?: string }>;
  toBigNumber(value: number | string): {
    multipliedBy(value: number): {
      toFixed(decimals: number): string;
    };
  };
  defaultAddress: {
    base58: string;
  };
  contract(): {
    at(address: string): Promise<TronContract>;
  };
  trx: {
    getUnconfirmedTransactionInfo(txHash: string): Promise<{
      receipt?: {
        result: string;
      };
    }>;
  };
}

declare global {
  interface Window {
    tronLink?: TronLinkWallet;
    tronWeb: TronWeb;
  }
}

export type { TronContract, TronContractMethod, TronLinkWallet, TronWeb };
