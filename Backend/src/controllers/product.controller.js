import productModel from "../models/product.model.js";
import { uploadImages } from "../services/storage.service.js";
import userModel from "../models/user.model.js";



export async function createProductController(req,res) {
    const {name,description,amount,currency}=req.body;
    const images=req.files;

    const user=await userModel.findById(req.user.id);

    try {
        const uploadedImages=await uploadImages({images,filename:name,folder:`FitFusion/products/${user.fullname}`});
        const product=await productModel.create({
            name,
            description,
            price:{
                amount,
                currency:currency || "INR"
            },
            images:uploadedImages,
            seller:req.user.id
        });
        return res.status(201).json({message:"Product created successfully",product});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error"});
    }
}