import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Airdrop from "@/models/Airdrop";

export async function GET() {
  await connectToDatabase();
  try {
    const airdrops = await Airdrop.find().sort({ createdAt: -1 });
    return NextResponse.json(airdrops);
  } catch (error: unknown) {
    console.error("获取空投记录失败:", error);
    return NextResponse.json({ error: "获取空投记录失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connectToDatabase();
  try {
    const data = await request.json();
    const airdrop = await Airdrop.create(data);
    return NextResponse.json(airdrop);
  } catch (error: unknown) {
    console.error("创建空投记录失败:", error);
    return NextResponse.json({ error: "创建空投记录失败" }, { status: 500 });
  }
}
