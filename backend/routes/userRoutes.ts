import express from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth";
import { deleteUser, getAllUsers,  myProfile,  updateUserDetails, updateUserRole } from "../controllers/userController";
import { validate } from "../middleware/validation";
import { updateUserRoleSchema, userLoginSchema, userSchema } from "../utils/zod";
import { upload } from "../utils/upload";
import { forgotPassword, login, register, resendOtp, resetPassword, verifyOtp, verifyRegistration } from "../controllers/authController";
import { limiter } from "../utils/rateLimiter";

const router = express.Router();

// Signup
router.post("/signup",validate(userSchema), register);
router.post("/verify-registration-otp", verifyRegistration);
router.post("/resend-otp",limiter, resendOtp);
// Login
router.post("/login", validate(userLoginSchema),login);

// reset password
router.post("/forgot-password",forgotPassword)
router.post("/verify-otp",verifyOtp)
router.post("/reset-password",resetPassword)

// Protected routes
router.get('/my-profile', authenticateToken, myProfile);
router.get('/', authenticateToken, authorizeRoles('ADMIN', 'STAFF'), getAllUsers);
router.put('/:id/role', authenticateToken, authorizeRoles('ADMIN', 'STAFF'), validate(updateUserRoleSchema),updateUserRole);
router.put('/:id', authenticateToken, upload.single("image"),updateUserDetails);

router.delete('/:id', authenticateToken, deleteUser);


export default router;
