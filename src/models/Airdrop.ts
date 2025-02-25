// Author: segon
// GitHub: https://github.com/segonse/segonse
// This file is for tron airdrop

import mongoose from "mongoose";

const airdropDetailSchema = new mongoose.Schema({
  address: { type: String, required: true }, // 接收地址
  amount: { type: String, required: true }, // 接收金额
});

const airdropSchema = new mongoose.Schema(
  {
    tokenName: { type: String, required: true }, // 代币名称
    tokenAddress: { type: String, required: true }, // 代币地址
    tokenSymbol: { type: String, required: true }, // 代币符号
    tokenDecimals: { type: Number, required: true }, // 代币精度
    fromAddress: { type: String, required: true }, // 空投执行者地址
    contractAddress: { type: String, required: true }, // 空投合约地址
    totalAddresses: { type: Number, required: true }, // 空投总地址数
    totalAmount: { type: String, required: true }, // 空投总金额
    txHash: { type: String, required: true }, // 交易哈希
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    details: [airdropDetailSchema], // 空投详情
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Airdrop =
  mongoose.models.Airdrop || mongoose.model("Airdrop", airdropSchema);

export default Airdrop;
