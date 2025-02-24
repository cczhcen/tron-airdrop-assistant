import mongoose from "mongoose";
import slugify from "slugify";

const addressSchema = new mongoose.Schema({
  group_id: { type: String, required: true }, // 所属分组的 ID
  address: { type: String, required: true }, // 钱包地址
  description: { type: String, default: "" }, // 可选描述
});

const addressGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "地址组名称是必需的"],
      unique: true,
      maxLength: [50, "地址组名称不能超过50个字符"],
      minLength: [2, "地址组名称至少需要2个字符"],
    },
    addresses: {
      type: [addressSchema], // 使用 addressSchema
      default: [], // 默认初始化为空数组
    },
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Mongoose 中间件
// 文档中间件：在 .save() 和 .create() 之前运行
addressGroupSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// 检查模型是否已存在
const AddressGroup =
  mongoose.models.AddressGroup ||
  mongoose.model("AddressGroup", addressGroupSchema);

export default AddressGroup;
