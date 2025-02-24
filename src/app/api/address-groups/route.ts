import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import AddressGroup from "@/models/AddressGroup";
import { corsHeaders } from "@/utils/cors";

export async function GET() {
  await connectToDatabase();
  try {
    const groups = await AddressGroup.find().sort({ createdAt: -1 });
    return NextResponse.json(groups, { headers: corsHeaders });
  } catch (error: unknown) {
    console.error("获取地址组失败:", error);
    return NextResponse.json(
      { error: "获取地址组失败" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: Request) {
  await connectToDatabase();
  try {
    const { name } = await request.json();
    const group = await AddressGroup.create({ name, addresses: [] });
    return NextResponse.json(group, { headers: corsHeaders });
  } catch (error: unknown) {
    console.error("创建地址组失败:", error);
    return NextResponse.json(
      { error: "创建地址组失败" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PUT(request: Request) {
  await connectToDatabase();
  try {
    const { id, name, addresses } = await request.json();
    const group = await AddressGroup.findByIdAndUpdate(
      id,
      { name, addresses, updatedAt: Date.now() },
      { new: true }
    );
    return NextResponse.json(group, { headers: corsHeaders });
  } catch (error: unknown) {
    console.error("更新地址组失败:", error);
    return NextResponse.json(
      { error: "更新地址组失败" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(request: Request) {
  await connectToDatabase();
  try {
    const { id } = await request.json();
    await AddressGroup.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "地址组已删除" },
      { headers: corsHeaders }
    );
  } catch (error: unknown) {
    console.error("删除地址组失败:", error);
    return NextResponse.json(
      { error: "删除地址组失败" },
      { status: 500, headers: corsHeaders }
    );
  }
}
