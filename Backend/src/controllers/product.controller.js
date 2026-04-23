import productModel from "../models/product.model.js";
import { uploadImages } from "../services/storage.service.js";
import userModel from "../models/user.model.js";


export async function createProductController(req, res) {
  try {
    const { name, description, amount, currency, category } = req.body;
    let { attributes } = req.body;
    const images = req.files;

    attributes =
      typeof attributes === "string" ? JSON.parse(attributes) : attributes;

    if (!name || !description || !amount) {
      return res.status(400).json({
        message: "Name, description, and price are required",
      });
    }

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const uploadedImages = await uploadImages({
      images,
      filename: name,
      folder: `FitFusion/products/${user.fullname}`,
    });

   
    const defaultVariant = {
      attributes: attributes || {},

      price: {
        amount: Number(amount),
        currency: currency || "INR",
      },

      stock: req.body.stock ? Number(req.body.stock) : 0,

      images: uploadedImages,
    };

    
    const product = await productModel.create({
      name,
      description,
      category,
      seller: req.user.id,
      variants: [defaultVariant],
    });


    product.defaultVariantId = product.variants[0]._id;
    await product.save();

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

export async function getSellerProductsController(req,res){
    try {
        const products=await productModel.find({seller:req.user.id});
        return res.status(200).json({
            message:"Products fetched successfully",
            success:true,
            products:products
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error"});
    }
}

export async function deleteProductController(req, res) {
    try {
        const { id } = req.params;
        const product = await productModel.findOneAndDelete({ _id: id, seller: req.user.id });

        if (!product) {
            return res.status(404).json({ message: "Product not found or unauthorized", success: false });
        }

        return res.status(200).json({ message: "Product deleted successfully", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export async function getAllProducts(req, res) {
    const products = await productModel.find()

    return res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products:products
    })
}

export async function getProductByIdController(req,res){
    const id=req.params.id;
    try{
        const product=await productModel.findById(id);
        if(!product){
            return res.status(404).json({message:"Product not found",success:false});
        }
        return res.status(200).json({
            message:"Product fetched successfully",
            success:true,
            product:product
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Server error",success:false});
    }
}

export async function addProductVarietyController(req,res){
    try {
        const { id } = req.params;
        const { stock } = req.body;
        
        // Fields arrive as strings in FormData, need to parse them
        const amount = req.body.amount;
        const currency = req.body.currency;
        const attributes = req.body.attributes ? JSON.parse(req.body.attributes) : {};
        const images = req.files;
        const product = await productModel.findById(id);

        if (!amount || !stock) {
            return res.status(400).json({ message: "Price and stock are required", success: false });
        }

        const isSameAttributes = (attr1, attr2) => {
            const keys1 = Object.keys(attr1);
            const keys2 = Object.keys(attr2);

            if (keys1.length !== keys2.length) return false;

            return keys1.every(key => attr2[key] === attr1[key]);
        };

        const exists = product.variants.some(v =>isSameAttributes(Object.fromEntries(v.attributes), attributes));

        if (exists) {
            return res.status(400).json({message: "Variant already exists",success: false});
        }

        
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        const seller = await userModel.findById(req.user.id);

        // Upload images to storage (ImageKit)
        const uploadedImages = await uploadImages({
            images,
            filename: `${product.name}-variant`,
            folder: `FitFusion/products/${seller.fullname}/variants`
        });

        const newVariant = {
            images: uploadedImages,
            stock: Number(stock),
            attributes,
            price: {
                amount: Number(amount),
                currency: currency || "INR"
            }
        };

        product.variants.push(newVariant);
        await product.save();

        return res.status(200).json({
            message: "Product variety added successfully",
            success: true,
            product: product
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}
            
    
