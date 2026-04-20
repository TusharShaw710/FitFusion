import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        amount:{
            type:String,
            required:true
        },
        currency:{
            type:String,
            enum:["INR","USD","EUR","GBR","JPY"],
            default:"INR"
        }
    },
    images:[
        {
            url:{
                type:String,
                required:true
            }
        }
    ],
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
});

const productModel = mongoose.model("product",productSchema);

export default productModel;