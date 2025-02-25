// Author: segon
// GitHub: https://github.com/segonse/segonse
// This file is for tron airdrop

import mongoose from "mongoose";

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.DATABASE_URL || "");
    isConnected = true;
    console.log("MongoDB 连接成功");
  } catch (error) {
    console.error("MongoDB 连接失败:", error);
    throw error;
  }
};

export default connectToDatabase;
