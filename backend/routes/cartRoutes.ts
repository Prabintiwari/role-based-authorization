import express from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth";
import { 
  addToCart, 
  getAllCarts, 
  getMyCart, 
  deleteCart, 
  updateCartQuantity, 
  removeFromCart 
} from "../controllers/cartControllers";
import { validate } from "../middleware/validation";
import { addToCartSchema } from "../utils/zod";

const router = express.Router();

router.get("/get-all-carts", authenticateToken, authorizeRoles("STAFF", "ADMIN"), getAllCarts);

router.get("/get-my-cart", authenticateToken, getMyCart);

router.post("/add-to-cart", authenticateToken, validate(addToCartSchema), addToCart);

router.put("/update-quantity", authenticateToken, updateCartQuantity);

router.delete("/clear-cart", authenticateToken, deleteCart);

router.delete("/remove-item/:productId", authenticateToken, removeFromCart);


export default router;