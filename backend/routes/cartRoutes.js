import express from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import { 
  addToCart, 
  getAllCarts, 
  getMyCart, 
  deleteCart, 
  updateCartQuantity, 
  removeFromCart 
} from "../controllers/cartControllers.js";

const router = express.Router();

router.get("/get-all-carts", authenticateToken, authorizeRoles("STAFF", "ADMIN"), getAllCarts);

router.get("/get-my-cart", authenticateToken, getMyCart);

router.post("/add-to-cart", authenticateToken, addToCart);

router.put("/update-quantity", authenticateToken, updateCartQuantity);

router.delete("/clear-cart", authenticateToken, deleteCart);

router.delete("/remove-item/:productId", authenticateToken, removeFromCart);

export default router;