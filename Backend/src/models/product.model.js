import mongoose from "mongoose";
import variantSchema from "./variant.schema.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      enum: ["Jeans", "Shorts", "T-Shirts", "Shoes", "Tracksuit", "Others"],
      default: "Others"
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },

    variants: {
      type: [variantSchema],
    },

    defaultVariantId: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  { timestamps: true }
);

productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });
productSchema.index({ "variants.attributes": 1 });

const productModel = mongoose.model("product", productSchema);

export default productModel;