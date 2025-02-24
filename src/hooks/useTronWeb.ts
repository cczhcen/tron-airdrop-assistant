"use client";

import { useState, useEffect } from "react";
import type { TronWeb } from "@/types/tronweb";

export function useTronWeb() {
  const [tronWeb, setTronWeb] = useState<TronWeb | null>(null);
  const [address, setAddress] = useState("");

  const connectWallet = async () => {
    if (typeof window.tronLink === "undefined") {
      console.error("TronLink 钱包未安装，请安装后重试。");
      return;
    }

    try {
      await window.tronLink.request({ method: "tron_requestAccounts" });
      const tronWeb = window.tronWeb;

      // 确保 tronWeb 不是 undefined
      if (tronWeb) {
        setTronWeb(tronWeb);
        setAddress(tronWeb.defaultAddress.base58);
      } else {
        console.error("无法获取 tronWeb 对象");
      }
    } catch (error) {
      console.error("用户拒绝了连接请求", error);
    }
  };

  useEffect(() => {
    const initTronWeb = async () => {
      if (window.tronWeb) {
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
