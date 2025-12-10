import { Request, Response } from "express";
import prisma from "../utils/Prisma";

// Get All Carts
const getAllCarts = async (req: Request, res: Response) => {
  try {
    const carts = await prisma.cart.findMany({});
    res.json({ success: true, carts });
  } catch (error) {
    console.error("Get carts error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Get cart by user id
const getMyCart = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }
    const cart = await prisma.cart.findMany({
      where: { user_id: req.user.id },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            category: true,
            price: true,
          },
        },
      },
    });
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Get carts error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Add to cart
const addToCart = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }
    const userId = req.user.id;
    const productId = req.body?.productId;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized: user id missing" });
    }
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return res
        .status(400)
        .json({ success: false, error: "Product not found!" });
    }

    const cartProduct = await prisma.cart.upsert({
      where: { user_id_product_id: { user_id: userId, product_id: productId } },
      update: { count: { increment: 1 } },
      create: { user_id: userId, product_id: productId, count: 1 },
      include: {
        product: {
          select: { id: true, title: true, category: true, price: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully!",
      cartProduct,
    });
  } catch (error) {
    console.error("Add to cart Failed:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Delete entire cart
const deleteCart = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }
    const userId = req.user.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized: user id missing" });
    }
    await prisma.cart.deleteMany({
      where: { user_id: userId },
    });

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully!",
    });
  } catch (error) {
    console.error("Delete cart Failed:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Update cart item quantity
const updateCartQuantity = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }
    const userId = req.user.id;
    const productId = req.body?.productId;
    const action = req.body?.action;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, error: "Product id is required!" });
    }
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized: user id missing" });
    }

    if (!action || !["increment", "decrement"].includes(action)) {
      return res.status(400).json({
        success: false,
        error: "Action must be 'increment' or 'decrement'",
      });
    }

    const cartItem = await prisma.cart.findUnique({
      where: { user_id_product_id: { user_id: userId, product_id: productId } },
    });

    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, error: "Item not found in cart!" });
    }

    if (action === "decrement" && cartItem.count <= 1) {
      await prisma.cart.delete({
        where: {
          user_id_product_id: { user_id: userId, product_id: productId },
        },
      });
      return res.status(200).json({
        success: true,
        message: "Item removed from cart!",
        deleted: true,
      });
    }

    const updatedItem = await prisma.cart.update({
      where: { user_id_product_id: { user_id: userId, product_id: productId } },
      data: {
        count: action === "increment" ? { increment: 1 } : { decrement: 1 },
      },
      include: {
        product: {
          select: { id: true, title: true, category: true, price: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: `Quantity ${action}ed successfully!`,
      cartItem: updatedItem,
    });
  } catch (error) {
    console.error("Update cart quantity Failed:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Remove single item from cart
const removeFromCart = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }
    const userId = req.user.id;
    const productId = req.params.productId;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, error: "Product id is required!" });
    }
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized: user id missing" });
    }

    const cartItem = await prisma.cart.findUnique({
      where: { user_id_product_id: { user_id: userId, product_id: productId } },
    });

    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, error: "Item not found in cart!" });
    }

    await prisma.cart.delete({
      where: { user_id_product_id: { user_id: userId, product_id: productId } },
    });

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully!",
    });
  } catch (error) {
    console.error("Remove from cart Failed:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export {
  getAllCarts,
  getMyCart,
  addToCart,
  deleteCart,
  updateCartQuantity,
  removeFromCart,
};
