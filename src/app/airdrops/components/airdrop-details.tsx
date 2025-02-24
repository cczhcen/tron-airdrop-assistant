"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AirdropDetail } from "@/types";

interface AirdropDetailsProps {
  details: AirdropDetail[];
}

export function AirdropDetails({ details }: AirdropDetailsProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>接收地址</TableHead>
            <TableHead>接收金额</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {details.map((detail, index) => (
            <TableRow key={index}>
              <TableCell className="font-mono text-black">
                {detail.address}
              </TableCell>
              <TableCell className="text-black">{detail.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
