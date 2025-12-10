import { Request, Response } from "express";
import { deleteFile, fileUpload } from "../utils/fileServices";
import prisma from "../utils/Prisma";

// Get All Users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// get user profile
const myProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "internal Server error" });
  }
};

const updateUserDetails = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const body = req.body;
  const file = req.file;
  let filePath = undefined;
  if (!file) {
    return res.status(400).json({
      success: false,
      error: "No file uploaded",
    });
  }
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    });
  }
  if (file) {
    filePath = fileUpload(file, "users");
    if (existingUser.image) {
      deleteFile(existingUser.image);
    }
  }
  const user = await prisma.user.update({
    where: { id: userId },
    data: { image: filePath, ...body },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
    },
  });
  res.json({
    success: true,
    message: "User details updated successfully",
    user,
  });
};

// Update User Role
const updateUserRole = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }
    const { role } = req.body;
    const userId = req.params.id;

    // Staff cannot promote to Admin
    if (req.user.role === "STAFF" && role === "ADMIN") {
      return res
        .status(403)
        .json({ success: false, error: "Staff cannot promote users to Admin" });
    }

    // Cannot change own role
    if (req.user.id === userId) {
      return res
        .status(400)
        .json({ success: false, error: "Cannot change your own role" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    res.json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Delete User
const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const existinguser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existinguser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    if (existinguser.image) {
      deleteFile(existinguser.image);
    }
    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, error: "internal server error" });
  }
};

export {
  getAllUsers,
  myProfile,
  updateUserRole,
  deleteUser,
  updateUserDetails,
};
