// Author: segon
// GitHub: https://github.com/segonse/segonse
// This file is for tron airdrop

"use client";

import { useState, useEffect } from "react";
import type { TronWeb } from "@/types/tronweb";
import toast from "react-hot-toast";

export function useTronWeb() {
  const [tronWeb, setTronWeb] = useState<TronWeb | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.tronLink === "undefined") {
      console.log("请安装 TronLink 钱包扩展");
      toast.error("请安装 TronLink 钱包扩展");
      return;
    }

    try {
      const tronWeb = window.tronWeb;

      const res = await tronWeb.request({
        method: "tron_requestAccounts",
      });

      if (!res) {
        toast.error("请先解锁 TronLink 钱包");
        return;
      } else if (res.code === 4001) {
        toast.error("用户拒绝了连接请求");
        return;
      }

      if (tronWeb && res.code === 200) {
        setTronWeb(tronWeb);
        setAddress(tronWeb.defaultAddress.base58);
      } else {
        toast.error("无法获取 tronWeb 对象");
      }
    } catch (error) {
      toast.error("用户拒绝了连接请求: " + (error as Error).message);
    }
  };

  useEffect(() => {
    const initTronWeb = async () => {
      if (window.tronWeb && window.tronWeb.defaultAddress) {
        setTronWeb(window.tronWeb);
        setAddress(window.tronWeb.defaultAddress.base58);
      }
    };

    initTronWeb();
  }, []);

  // 监听账户变化和断开连接
  useEffect(() => {
    const handleAccountsChanged = (e: MessageEvent) => {
      if (e.data.message && e.data.message.action === "accountsChanged") {
        const newAddress = e.data.message.data.address;
        setAddress(newAddress ? newAddress : ""); // 如果地址为 false，清空地址
      }
    };

    const handleDisconnect = (e: MessageEvent) => {
      if (e.data.message && e.data.message.action === "disconnect") {
        setAddress(""); // 清空地址
      }
    };

    window.addEventListener("message", handleAccountsChanged);
    window.addEventListener("message", handleDisconnect);

    return () => {
      window.removeEventListener("message", handleAccountsChanged);
      window.removeEventListener("message", handleDisconnect);
    };
  }, []);

  return { tronWeb, address, connectWallet };
}
