import productModel from "../models/product.model.js";
import cartModel from "../models/cart.model.js";
import { stockOfVariant } from "../dao/stock.dao.js";


export const addToCart = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        let { quantity } = req.body;

        quantity = Number(quantity);
        if (!quantity || quantity <= 0) {
            quantity = 1;
        }

    
        const product = await productModel.findOne(
            {
                _id: productId,
                "variants._id": variantId
            },
            {
                "variants.$": 1,
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product or variant not found",
                success: false
            });
        }

        const stock = await stockOfVariant(productId, variantId);

        if (stock <= 0) {
            return res.status(400).json({
                message: "Item is out of stock",
                success: false
            });
        }

        
        let cart = await cartModel.findOne({ user: req.user._id });

        if (!cart) {
            cart = await cartModel.create({ user: req.user._id, items: [] });
        }

        
        const existingItem = cart.items.find(
            item =>
                item.product.toString() === productId &&
                item.variant?.toString() === variantId
        );

        if (existingItem) {
            if (existingItem.quantity + quantity > stock) {
                return res.status(400).json({
                    message: `Only ${stock} items available. You already have ${existingItem.quantity} in cart.`,
                    success: false
                });
            }

            existingItem.quantity += quantity;
        } else {
            if (quantity > stock) {
                return res.status(400).json({
                    message: `Only ${stock} items available`,
                    success: false
                });
            }

            cart.items.push({
                product: productId,
                variant: variantId,
                quantity,
                price: product.variants[0].price
            });
        }

        await cart.save();

        return res.status(200).json({
            message: "Cart updated successfully",
            success: true,
            cart
        });

    } catch (error) {
        console.error("Add to cart error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getCart = async (req, res) => {
    const user = req.user

    let cart = await cartModel.aggregate([
    {
      $match: {
        user: user._id
      }
    },
    { $unwind: { path: '$items' } },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'items.product'
      }
    },
    { $unwind: { path: '$items.product' } },
    {
      $unwind: { path: '$items.product.variants' }
    },
    {
      $match: {
        $expr: {
          $eq: [
            '$items.variant',
            '$items.product.variants._id'
          ]
        }
      }
    },
    {
      $addFields: {
        itemPrice: {
          $multiply: [
            '$items.quantity',
            '$items.product.variants.price.amount'
          ]
        }
      }
    },
    {
      $group: {
        _id: '$_id',
        total: { $sum: '$itemPrice' },
        items: { $push: '$items' },
        currency: {
          $first: '$items.price.currency'
        }
      }
    }

    ]);
    
    if (!cart) {
        cart = await cartModel.create({ user: user._id })
    }

    return res.status(200).json({
        message: "Cart fetched successfully",
        success: true,
        cart
    })
}

export const incrementCartItemQuantity = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        const product = await productModel.findOne(
            {
                _id: productId,
                "variants._id": variantId
            },
            {
                "variants.$": 1,
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product or variant not found",
                success: false
            });
        }

        const cart = await cartModel.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            });
        }

        const item = cart.items.find(
            item =>
                item.product.toString() === productId &&
                item.variant?.toString() === variantId
        );

        if (!item) {
            return res.status(404).json({
                message: "Item not found in cart",
                success: false
            });
        }

        const stock = await stockOfVariant(productId, variantId);

        if (item.quantity + 1 > stock) {
            return res.status(400).json({
                message: `Only ${stock} items left. You already have ${item.quantity}`,
                success: false
            });
        }

        item.quantity += 1;

        await cart.save();

        return res.status(200).json({
            message: "Cart item quantity incremented successfully",
            success: true,
            cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const decrementCartItemQuantity = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        const product = await productModel.findOne(
            {
                _id: productId,
                "variants._id": variantId
            },
            {
                "variants.$": 1,
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product or variant not found",
                success: false
            });
        }

        const cart = await cartModel.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            });
        }

        const item = cart.items.find(
            item =>
                item.product.toString() === productId &&
                item.variant?.toString() === variantId
        );

        if (!item) {
            return res.status(404).json({
                message: "Item not found in cart",
                success: false
            });
        }

        if (item.quantity - 1 === 0) {
            cart.items = cart.items.filter(
                item =>
                    item.product.toString() !== productId ||
                    item.variant?.toString() !== variantId
            );
        } else {
            item.quantity -= 1;
        }

        await cart.save();

        return res.status(200).json({
            message: "Cart item quantity decremented successfully",
            success: true,
            cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const { variantId } = req.params;

        const cart = await cartModel.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            });
        }

        cart.items = cart.items.filter(
            item => item.variant?.toString() !== variantId
        );

        await cart.save();

        return res.status(200).json({
            message: "Cart item removed successfully",
            success: true,
            cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};