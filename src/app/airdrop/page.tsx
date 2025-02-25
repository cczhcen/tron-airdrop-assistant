"use client";

import { useState, useEffect } from "react";
import { useTronWeb } from "@/hooks/useTronWeb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GroupList } from "@/app/address-groups/components/group-list";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AddressGroup } from "@/types";

export default function Airdrop() {
  const [sameAmountValue, setSameAmountValue] = useState(0);
  const [randomMin, setRandomMin] = useState(0);
  const [randomMax, setRandomMax] = useState(0);
  const [decimalPlaces, setDecimalPlaces] = useState(0);
  const [tokenInfo, setTokenInfo] = useState<{
    name: string;
    symbol: string;
    balance: number;
    decimals: number;
  } | null>(null);
  const { tronWeb, address } = useTronWeb();
  const [addresses, setAddresses] = useState<
    { address: string; amount: string }[]
  >([]);
  const [tokenAddress, setTokenAddress] = useState("");
  const router = useRouter();
  const [groups, setGroups] = useState<AddressGroup[]>([]);

  const AIRDROP_ADDRESS = process.env.NEXT_PUBLIC_AIRDROP_ADDRESS; // 固定的合约地址

  // 获取地址组列表
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await api.getGroups();
        setGroups(data);
      } catch (error) {
        console.error("获取地址组失败:", error);
        toast.error("获取地址组失败");
      }
    };
    fetchGroups();
  }, []);

  const handleAirdrop = async () => {
    if (!tronWeb || !address) {
      toast.error("请先连接钱包");
      return;
    }

    // 检查 tokenInfo 是否已加载
    if (!tokenInfo?.decimals) {
      toast.error("代币信息未加载，无法执行空投");
      return;
    }

    const precision = 10 ** tokenInfo.decimals; // 使用 tokenInfo 中的精度

    // 地址和金额数组，金额需要乘以精度
    const airdropAddress = addresses.map((addr) => addr.address);
    const airdropAmounts = addresses.map((addr) => {
      const amount = parseFloat(addr.amount);
      const totalAmount = tronWeb
        .toBigNumber(amount)
        .multipliedBy(precision)
        .toFixed(0); // 使用 tronWeb.toBigNumber

      return totalAmount;
    });
    // console.log(airdropAmounts);

    // 确保 airdropAmounts 和 airdropAddress 长度一致
    if (airdropAmounts.length !== airdropAddress.length) {
      console.error("选定的地址和空投金额的数量不匹配");
      return;
    }

    // 检查 airdropAddress 是否为空
    if (airdropAddress.some((addr) => !addr)) {
      toast.error("地址不能为空");
      return;
    }
    // 检查 airdropAmounts 是否为空
    if (airdropAmounts.some((amount) => !amount)) {
      toast.error("数量不能为空");
      return;
    }

    try {
      const tokenContract = await tronWeb.contract().at(tokenAddress);
      const allowance = await tokenContract
        .allowance(address, AIRDROP_ADDRESS)
        .call();
      const allowanceAmount = parseFloat(allowance) / 10 ** tokenInfo!.decimals;

      // 转换为小数
      const totalAirdropAmount = addresses.reduce(
        (sum, addr) => sum + parseFloat(addr.amount),
        0
      );
      const totalAirdropAmountBN = tronWeb
        .toBigNumber(totalAirdropAmount)
        .multipliedBy(precision)
        .toFixed(0);
      console.log(allowance, totalAirdropAmountBN, totalAirdropAmount);

      if (allowanceAmount < totalAirdropAmount) {
        const toastId = toast.loading("代币额度不足，请先授权");
        const tx = await tokenContract
          .approve(AIRDROP_ADDRESS, totalAirdropAmountBN)
          .send({
            feeLimit: 10000000000,
          });

        setTimeout(async () => {
          const result = await tronWeb.trx.getUnconfirmedTransactionInfo(tx);
          try {
            if (result?.receipt?.result === "SUCCESS") {
              toast.success("代币授权成功", { id: toastId });
            } else {
              toast.error("代币授权失败", { id: toastId });
            }
          } catch (err) {
            console.error("检查交易状态失败:", err);
            toast.error("代币授权失败", { id: toastId });
          }
        }, 3000);
      } else {
        toast.success("代币授权额度充足");
      }

      const airdropContract = await tronWeb.contract().at(AIRDROP_ADDRESS);
      const tx = await airdropContract
        .batchTransferTokenSimple(tokenAddress, airdropAddress, airdropAmounts)
        .send({
          feeLimit: 10000000000,
        });

      // 保存空投记录到数据库
      await api.createAirdrop({
        tokenName: tokenInfo!.name,
        tokenAddress: tokenAddress,
        tokenSymbol: tokenInfo!.symbol,
        tokenDecimals: tokenInfo!.decimals,
        fromAddress: address!,
        contractAddress: AIRDROP_ADDRESS,
        totalAddresses: airdropAddress.length,
        totalAmount: addresses
          .reduce((sum, addr) => sum + parseFloat(addr.amount), 0)
          .toString(),
        txHash: tx,
        details: addresses.map((addr) => ({
          address: addr.address,
          amount: addr.amount,
        })),
      });

      toast.success("空投执行成功！");

      // 3秒后跳转到交易记录页面
      setTimeout(() => {
        router.push("/airdrops");
      }, 3000);
    } catch (err) {
      console.error("合约操作失败:", err);
      toast.error("操作失败");
    }
  };

  const handleLoadTokenInfo = async () => {
    if (!tokenAddress) {
      toast.error("请先输入代币合约地址");
      return;
    }

    if (!tronWeb || !address) {
      toast.error("请先连接钱包");
      return;
    }

    try {
      const tokenContract = await tronWeb.contract().at(tokenAddress);
      const [name, symbol, balance, decimals] = await Promise.all([
        tokenContract.name().call(),
        tokenContract.symbol().call(),
        tokenContract.balanceOf(address).call(),
        tokenContract.decimals().call(),
      ]);

      setTokenInfo({
        name,
        symbol,
        balance: parseFloat(balance) / 10 ** decimals,
        decimals,
      });
      toast.success("代币信息加载成功！");
    } catch (error) {
      console.error("加载代币信息失败:", error);
      toast.error("代币信息加载失败，请检查代币合约地址是否正确");
    }
  };

  const handleSameAmount = () => {
    setAddresses(
      addresses.map((addr) => ({ ...addr, amount: sameAmountValue.toString() }))
    );
  };

  const handleRandomAmount = () => {
    const newAddresses = addresses.map((addr) => {
      const randomAmount = Math.random() * (randomMax - randomMin) + randomMin; // 生成随机数
      return { ...addr, amount: randomAmount.toFixed(decimalPlaces) }; // 设置小数位数
    });
    setAddresses(newAddresses);
  };

  const handleAddAddress = () => {
    setAddresses((prev) => [...prev, { address: "", amount: "" }]);
  };

  const handleDeleteAddress = (index: number) => {
    setAddresses((prev) => {
      const newAddresses = prev.filter((_, i) => i !== index);
      // 如果删除后地址列表为空，不需要添加空行
      return newAddresses;
    });
  };

  const handleImportGroup = (
    group: AddressGroup,
    selectedAddresses?: string[]
  ) => {
    const addressesToImport = selectedAddresses
      ? group.addresses?.filter((addr) =>
          selectedAddresses.includes(addr.address)
        )
      : group.addresses;

    if (addressesToImport) {
      // 获取现有地址列表中的地址，用于去重
      const existingAddresses = new Set(
        addresses
          .filter((addr) => addr.address !== "")
          .map((addr) => addr.address)
      );

      // 过滤掉已存在的地址，只添加新地址
      const newAddresses = addressesToImport.filter(
        (addr) => !existingAddresses.has(addr.address)
      );

      if (newAddresses.length === 0) {
        toast("所选地址已全部导入", {
          icon: "⚠️",
          style: {
            background: "#FEF3C7",
            color: "#92400E",
          },
        });
        return;
      }

      // 将新地址追加到现有地址列表，如果当前列表只有一个空地址，则替换它
      setAddresses((prev) => {
        const validAddresses = prev.filter((addr) => addr.address !== "");
        return [
          ...validAddresses,
          ...newAddresses.map((addr) => ({
            address: addr.address,
            amount: "", // 初始金额为空
          })),
        ];
      });

      toast.success(`已导入 ${newAddresses.length} 个新地址`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-center" />
      <h1 className="text-2xl font-bold text-gray-800 mb-4">代币空投</h1>
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <Input
          value={tokenAddress}
          onChange={(e) => {
            setTokenAddress(e.target.value);
          }}
          placeholder="请输入代币合约地址"
          className="text-black"
        />
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600"
          onClick={handleLoadTokenInfo}
        >
          加载
        </Button>
        {tokenInfo && (
          <div className="text-blue-400 text-sm">
            <p>代币名称: {tokenInfo.name}</p>
            <p>代币符号: {tokenInfo.symbol}</p>
            <p>
              你的钱包中代币余额: {tokenInfo.balance} {tokenInfo.symbol}
            </p>
          </div>
        )}
        <div>
          {addresses.map((addr, index) => (
            <div key={index} className="flex justify-between gap-1 py-0.5">
              <Input
                value={addr.address}
                onChange={(e) => {
                  const newAddresses = [...addresses];
                  newAddresses[index].address = e.target.value;
                  setAddresses(newAddresses);
                }}
                placeholder="输入地址"
                className="text-black"
              />
              <Input
                value={addr.amount}
                onChange={(e) => {
                  const newAddresses = [...addresses];
                  newAddresses[index].amount = e.target.value;
                  setAddresses(newAddresses);
                }}
                placeholder="输入数量"
                className="text-black"
              />
              <Button
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => handleDeleteAddress(index)}
              >
                删除
              </Button>
            </div>
          ))}
          <Button
            className="bg-green-500 text-white hover:bg-green-600 mt-2"
            onClick={handleAddAddress}
          >
            增加地址
          </Button>
        </div>
        <div className="flex gap-4 items-center">
          <Button
            className="bg-yellow-500 text-white hover:bg-yellow-600"
            onClick={handleSameAmount}
          >
            相同数量
          </Button>
          <Input
            type="number"
            value={sameAmountValue}
            onChange={(e) => setSameAmountValue(Number(e.target.value))}
            placeholder="相同数量"
            className="text-black w-32"
          />
        </div>
        <div className="flex gap-4 items-center">
          <Button
            className="bg-yellow-500 text-white hover:bg-yellow-600"
            onClick={handleRandomAmount}
          >
            随机数量
          </Button>
          <span className="text-gray-500">随机数量范围:</span>
          <Input
            type="number"
            value={randomMin}
            onChange={(e) => setRandomMin(Number(e.target.value))}
            placeholder="最小数量"
            className="text-black w-32"
          />
          <span className="text-gray-500">—</span>
          <Input
            type="number"
            value={randomMax}
            onChange={(e) => setRandomMax(Number(e.target.value))}
            placeholder="最大数量"
            className="text-black w-32"
          />
          <span className="text-gray-500">小数位数:</span>
          <Input
            type="number"
            value={decimalPlaces}
            onChange={(e) => setDecimalPlaces(Number(e.target.value))}
            placeholder="小数位数"
            className="text-black w-32"
          />
        </div>
        <Button
          className="bg-purple-600 text-white hover:bg-purple-700 text-lg py-2 px-4 mt-4"
          onClick={handleAirdrop}
        >
          执行空投
        </Button>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 text-black">导入地址组</h2>
          <GroupList
            groups={groups}
            selectable={true}
            onImport={handleImportGroup}
          />
        </div>
      </div>
    </div>
  );
}
