import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    attributes: {
      type: Map,
      of: String, // e.g. { Size: "M", Color: "Black" }
      required: true,
      default: {}
    },

    price: {
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      currency: {
        type: String,
        enum: ["INR", "USD", "EUR", "GBP", "JPY"],
        default: "INR"
      }
    },

    stock: {
      type: Number,
      default: 0,
      min: 0
    },

    images: [
      {
        url: {
          type: String,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);


export default variantSchema;