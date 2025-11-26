import express from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import { deleteUser, getAllUsers, login, myProfile, register, updateUserRole } from "../controllers/userController.js";

const router = express.Router();

// Signup
router.post("/signup", register);
// Login
router.post("/login", login);

// Protected routes
router.get('/my-profile', authenticateToken, myProfile);
router.get('/', authenticateToken, authorizeRoles('ADMIN', 'STAFF'), getAllUsers);
router.put('/:id/role', authenticateToken, authorizeRoles('ADMIN', 'STAFF'), updateUserRole);
router.delete('/:id', authenticateToken, deleteUser);


export default router;
