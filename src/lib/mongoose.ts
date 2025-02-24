import mongoose from "mongoose";

const connectToDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    return; // 已经连接
  }

  try {
    await mongoose.connect(process.env.DATABASE_URL || "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB 连接成功");
  } catch (error) {
    console.error("MongoDB 连接失败:", error);
    throw new Error("MongoDB 连接失败");
  }
};

export default connectToDatabase;
