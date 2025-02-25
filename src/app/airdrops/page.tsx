// Author: segon
// GitHub: https://github.com/segonse/segonse
// This file is for tron airdrop

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AirdropList } from "./components/airdrop-list";
import { useTronWeb } from "@/hooks/useTronWeb";
import type { Airdrop } from "@/types";

export default function Airdrops() {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const router = useRouter();
  const { tronWeb } = useTronWeb();

  const checkPendingTransactions = useCallback(
    async (pendingAirdrops: Airdrop[]) => {
      if (!tronWeb) return;

      for (const airdrop of pendingAirdrops) {
        try {
          const result = await tronWeb.trx.getUnconfirmedTransactionInfo(
            airdrop.txHash
          );
          if (result && result.receipt) {
            const newStatus =
              result.receipt.result === "SUCCESS" ? "success" : "failed";

            // 更新数据库
            await api.updateAirdropStatus(airdrop._id, newStatus);

            // 更新本地状态
            setAirdrops((prev) =>
              prev.map((item) =>
                item._id === airdrop._id ? { ...item, status: newStatus } : item
              )
            );
          }
        } catch (error) {
          console.error("检查交易状态失败:", error);
        }
      }
    },
    [tronWeb]
  );

  useEffect(() => {
    const fetchAirdrops = async () => {
      try {
        const data = await api.getAirdrops();
        setAirdrops(data);

        // 检查所有pending状态的交易
        const pendingAirdrops = data.filter(
          (airdrop: Airdrop) => airdrop.status === "pending"
        );
        if (pendingAirdrops.length > 0) {
          await checkPendingTransactions(pendingAirdrops);
        }
      } catch (error) {
        console.error("获取空投记录失败:", error);
        alert("获取空投记录失败");
      }
    };
    fetchAirdrops();
  }, [checkPendingTransactions]);

  const handleViewDetails = (id: string) => {
    router.push(`/airdrops/${id}`);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">空投记录</h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <AirdropList airdrops={airdrops} onViewDetails={handleViewDetails} />
      </div>
    </div>
  );
}
