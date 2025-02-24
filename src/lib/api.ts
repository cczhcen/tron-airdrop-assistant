import type { Address } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export const api = {
  // 地址组相关
  async getGroups() {
    const res = await fetch(`${API_BASE}/api/address-groups`);
    if (!res.ok) throw new Error("获取地址组失败");
    return res.json();
  },

  async createGroup(name: string) {
    const res = await fetch(`${API_BASE}/api/address-groups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("创建地址组失败");
    return res.json();
  },

  async updateGroup(id: string, name: string, addresses: Address[]) {
    const res = await fetch(`${API_BASE}/api/address-groups`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, addresses }),
    });
    if (!res.ok) throw new Error("更新地址组失败");
    return res.json();
  },

  async deleteGroup(id: string) {
    const res = await fetch(`${API_BASE}/api/address-groups`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("删除地址组失败");
    return res.json();
  },

  // 空投记录相关
  async getAirdrops() {
    const res = await fetch(`${API_BASE}/api/airdrops`);
    if (!res.ok) throw new Error("获取空投记录失败");
    return res.json();
  },

  async getAirdropDetails(id: string) {
    const res = await fetch(`${API_BASE}/api/airdrops/${id}`);
    if (!res.ok) throw new Error("获取空投详情失败");
    return res.json();
  },

  async createAirdrop(data: {
    tokenName: string;
    tokenAddress: string;
    tokenSymbol: string;
    tokenDecimals: number;
    fromAddress: string;
    contractAddress: string;
    totalAddresses: number;
    totalAmount: string;
    txHash: string;
    details: { address: string; amount: string }[];
  }) {
    const res = await fetch(`${API_BASE}/api/airdrops`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("创建空投记录失败");
    return res.json();
  },

  async updateAirdropStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/api/airdrops/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("更新空投状态失败");
    return res.json();
  },
};
