import express from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/productControllers.js";
const router = express.Router();


router.get("/",getAllProducts)
router.get("/:id",getProductById)
router.post("/createProduct/role",authenticateToken,authorizeRoles('ADMIN', 'STAFF'),createProduct)
router.put("/:id/role",authenticateToken, authorizeRoles('ADMIN', 'STAFF'),updateProduct)
router.delete("/:id/role",authenticateToken, authorizeRoles('ADMIN', 'STAFF'),deleteProduct)

export default router;