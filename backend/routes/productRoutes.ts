import express from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/productControllers";
import { validate } from "../middleware/validation";
import { productSchema } from "../utils/zod";
import { upload } from "../utils/upload";
const router = express.Router();


router.get("/",getAllProducts)
router.get("/:id",getProductById)
router.post("/createProduct/role",authenticateToken,authorizeRoles('ADMIN', 'STAFF'),upload.single("image"),validate(productSchema), createProduct)
router.put("/:id/role",authenticateToken, authorizeRoles('ADMIN', 'STAFF'),upload.single("image"), validate(productSchema), updateProduct)
router.delete("/:id/role",authenticateToken, authorizeRoles('ADMIN', 'STAFF'),deleteProduct)

export default router;