import { Request, Response } from "express";
import { deleteFile } from "../utils/fileServices";
import { fileUpload } from "../utils/fileServices";
import prisma from "../utils/Prisma";

// Get All Products
const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Get Single Product
const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Create Product
const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, price, quantity, category } = req.body;
    const file = req.file;
    let filePath = undefined;
    if (!file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }
    if (file) {
      filePath = fileUpload(file,"product");
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        quantity: quantity ? parseInt(quantity) : 0,
        category,
        image: filePath,
        user: {
          connect: { id: req.user?.id },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Update Product
const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const { title, description, price, quantity, category } = req.body;

    const file = req.file;
    let filePath = undefined;
    if (!file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }
    if (file) {
      filePath = fileUpload(file,"products");
      if (existingProduct.image) {
        deleteFile(existingProduct.image);
      }
    }

    // Update data
    const updateData = {
      title: title,
      description: description,
      category: category,
      price: price !== undefined ? parseFloat(price) : undefined,
      quantity: quantity !== undefined ? parseInt(quantity) : undefined,
      image: filePath,
    };

    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
// Delete Product
const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }
    if (existingProduct.image) {
      deleteFile(existingProduct.image);
    }
    await prisma.product.delete({
      where: { id: productId },
    });

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
