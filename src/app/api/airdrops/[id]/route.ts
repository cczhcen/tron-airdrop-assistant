// Author: segon
// GitHub: https://github.com/segonse/segonse
// This file is for tron airdrop

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Airdrop from "@/models/Airdrop";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  try {
    const airdrop = await Airdrop.findById(params.id);
    if (!airdrop) {
      return NextResponse.json({ error: "空投记录不存在" }, { status: 404 });
    }
    return NextResponse.json(airdrop);
  } catch (error: unknown) {
    console.error("获取空投记录失败:", error);
    return NextResponse.json({ error: "获取空投记录失败" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  try {
    const { status } = await request.json();
    const airdrop = await Airdrop.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );
    if (!airdrop) {
      return NextResponse.json({ error: "空投记录不存在" }, { status: 404 });
    }
    return NextResponse.json(airdrop);
  } catch (error: unknown) {
    console.error("更新空投状态失败:", error);
    return NextResponse.json({ error: "更新空投状态失败" }, { status: 500 });
  }
}
