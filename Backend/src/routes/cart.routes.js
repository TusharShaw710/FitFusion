import express from "express"
import { addToCart,getCart,incrementCartItemQuantity,decrementCartItemQuantity,removeCartItem } from "../controllers/cart.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { validateAddToCart,validateCartItemQuantity,validateRemoveFromCart } from "../validations/cart.validator.js";

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
router.patch("/increment/:productId/:variantId",authenticateUser,validateCartItemQuantity,incrementCartItemQuantity);

/**
 * @routes /api/cart/decrement/:productId/:variantId
 * @method PATCH
 * @description decrement cart item quantity
 * @access Private
 */
router.patch("/decrement/:productId/:variantId",authenticateUser,validateCartItemQuantity,decrementCartItemQuantity);

/**
 * @routes /api/cart/remove/:variantId
 * @method DELETE
 * @description remove cart item
 * @access Private
 */
router.delete("/remove/:variantId",authenticateUser,validateRemoveFromCart,removeCartItem);


export default router;


