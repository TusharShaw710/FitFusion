import express from "express"
import { addToCart,getCart,incrementCartItemQuantity } from "../controllers/cart.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { validateAddToCart,validateIncrementCartItemQuantity } from "../validations/cart.validator.js";

const router=express.Router();

/**
 * @routes /api/cart/add/:productId/:variantId
 * @method POST
 * @description add a product to cart
 * @access private
 */
router.post("/add/:productId/:variantId",authenticateUser,validateAddToCart,addToCart);

/**
 * @routes /api/cart
 * @method GET
 * @description Get user's cart
 * @access Private
 */
router.get("/",authenticateUser,getCart);

/**
 * @routes /api/cart/increment/:productId/:variantId
 * @method PATCH
 * @description increment cart item quantity
 * @access Private
 */
router.patch("/increment/:productId/:variantId",authenticateUser,validateIncrementCartItemQuantity,incrementCartItemQuantity);


export default router;


