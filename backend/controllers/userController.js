import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../middleware/auth.js";
const prisma = new PrismaClient();

//User register
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "USER",
      },
    });

    // Generate token
    const token = generateToken(user)

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "internal server error" });
  }
};

//User login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password are required" });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user)

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "internal Server error" });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
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
const myProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
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

// Update User Role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = parseInt(req.params.id);

    // Validate role
    if (!role || !["ADMIN", "STAFF", "USER"].includes(role)) {
      return res.status(400).json({ success: false, error: "Invalid role" });
    }

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
const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, error: "internal server error" });
  }
};

export { register, login, getAllUsers, myProfile, updateUserRole, deleteUser };
