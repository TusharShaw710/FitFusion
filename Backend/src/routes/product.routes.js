import {Router} from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import { createProductController,getSellerProductsController, deleteProductController,getAllProducts,getProductByIdController,addProductVarietyController,getProductByCategory } from "../controllers/product.controller.js";
import { validateProduct,validateAddVariant } from "../validations/product.validator.js";

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
/**
 * @routes /api/product/:id
 * @method GET
 * @description get a product by id
 * @access public
 */
router.get("/product/:id",getProductByIdController);

/**
 * @routes /api/product/add-variant/:id
 * @method PUT
 * @description add a variant to a product
 * @access private
 */
router.post("/add-variant/:id",authenticateSeller,upload.array("images",4),validateAddVariant,addProductVarietyController);


/**
 * @routes /api/product/category/:category
 * @method GET
 * @description get all products of a category
 * @access public
 */
router.get("/category/:category",getProductByCategory);

export default router;