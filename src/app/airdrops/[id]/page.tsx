// Author: segon
// GitHub: https://github.com/segonse/segonse
// This file is for tron airdrop

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { AirdropDetails } from "../components/airdrop-details";
import type { Airdrop } from "@/types";
import { Badge } from "@/components/ui/badge";

export default function AirdropDetail({ params }: { params: { id: string } }) {
  const [airdrop, setAirdrop] = useState<Airdrop | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAirdropDetails = async () => {
      try {
        const data = await api.getAirdropDetails(params.id);
        setAirdrop(data);
      } catch (error) {
        console.error("获取空投详情失败:", error);
        alert("获取空投详情失败");
      }
    };
    fetchAirdropDetails();
  }, [params.id]);

  if (!airdrop) {
    return <div>加载中...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">空投详情</h1>
        <Button variant="outline" onClick={() => router.back()}>
          返回列表
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">代币信息</h2>
            <p className="mt-1 text-black">
              {airdrop.tokenName} ({airdrop.tokenSymbol})
            </p>
            <p className="mt-1 font-mono text-sm text-black">
              {airdrop.tokenAddress}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">空投执行者</h2>
            <p className="mt-1 font-mono text-sm text-black">
              {airdrop.fromAddress}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">合约地址</h2>
            <p className="mt-1 font-mono text-sm text-black">
              {airdrop.contractAddress}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">交易哈希</h2>
            <p className="mt-1 font-mono text-sm">
              <a
                href={`${process.env.NEXT_PUBLIC_TRONSCAN_URL}/transaction/${airdrop.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                {airdrop.txHash}
              </a>
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">总地址数</h2>
            <p className="mt-1 text-black">{airdrop.totalAddresses}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">总金额</h2>
            <p className="mt-1 text-black">{airdrop.totalAmount}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">状态</h2>
            <Badge
              variant={
                airdrop.status === "success"
                  ? "success"
                  : airdrop.status === "failed"
                  ? "destructive"
                  : "secondary"
              }
            >
              {airdrop.status}
            </Badge>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">创建时间</h2>
            <p className="mt-1 text-black">
              {new Date(airdrop.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="pt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">空投详情</h2>
          <AirdropDetails details={airdrop.details} />
        </div>
      </div>
    </div>
  );
}
