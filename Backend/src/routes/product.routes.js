import {Router} from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import { createProductController } from "../controllers/product.controller.js";
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

export default router;