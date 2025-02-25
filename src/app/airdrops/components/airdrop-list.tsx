// Author: segon
// GitHub: https://github.com/segonse/segonse
// This file is for tron airdrop

"use client";

import { Airdrop } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatAddress } from "@/utils/format";

interface AirdropListProps {
  airdrops: Airdrop[];
  onViewDetails: (id: string) => void;
}

export function AirdropList({
  airdrops = [],
  onViewDetails,
}: AirdropListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>代币名称</TableHead>
            <TableHead>代币地址</TableHead>
            <TableHead>空投执行者地址</TableHead>
            <TableHead>空投合约地址</TableHead>
            <TableHead>总地址数</TableHead>
            <TableHead>总金额</TableHead>
            <TableHead>交易哈希</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {airdrops.map((airdrop) => (
            <TableRow key={airdrop._id}>
              <TableCell className="font-medium text-black">
                {airdrop.tokenName} ({airdrop.tokenSymbol})
              </TableCell>
              <TableCell className="font-mono text-black">
                {formatAddress(airdrop.tokenAddress)}
              </TableCell>
              <TableCell className="font-mono text-black">
                {formatAddress(airdrop.fromAddress)}
              </TableCell>
              <TableCell className="font-mono text-black">
                {formatAddress(airdrop.contractAddress)}
              </TableCell>
              <TableCell className="text-black">
                {airdrop.totalAddresses}
              </TableCell>
              <TableCell className="text-black">
                {airdrop.totalAmount}
              </TableCell>
              <TableCell className="font-mono">
                <a
                  href={`${process.env.NEXT_PUBLIC_TRONSCAN_URL}/transaction/${airdrop.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {formatAddress(airdrop.txHash)}
                </a>
              </TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell className="text-black">
                {new Date(airdrop.createdAt).toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(airdrop._id)}
                >
                  查看详情
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
