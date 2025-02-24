"use client";

import { useTronWeb } from "@/hooks/useTronWeb";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  const { address, connectWallet } = useTronWeb();

  return (
    <div className="flex flex-col items-center gap-4 mt-20">
      <Image src="/tron-icon.png" alt="Tron" width={70} height={70} />
      {address ? (
        <p className="text-gray-500">当前连接钱包地址: {address}</p>
      ) : (
        <Button onClick={connectWallet}>连接 TronLink 钱包</Button>
      )}
    </div>
  );
}
