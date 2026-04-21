import {Router} from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import { createProductController,getSellerProductsController, deleteProductController,getAllProducts } from "../controllers/product.controller.js";
import { validateProduct } from "../validations/product.validator.js";
import multer from "multer";

const upload=multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:1024*1024*5
    }
});
const router=Router();


/**
 * @routes /api/product/create
 * @method POST
 * @description create a new product
 * @access private
 */
router.post("/create",authenticateSeller,upload.array("images",7),validateProduct,createProductController);

/**
 * @routes /api/product/seller
 * @method GET
 * @description get all products of a seller
 * @access private
 */
router.get("/seller",authenticateSeller,getSellerProductsController);


/**
 * @route GET /api/products
 * @description Get all products
 * @access Public
 */
router.get("/", getAllProducts);

/**
 * @routes /api/product/delete/:id
 * @method DELETE
 * @description delete a product
 * @access private
 */
router.delete("/delete/:id", authenticateSeller, deleteProductController);

export default router;