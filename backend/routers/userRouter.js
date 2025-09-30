
import express from "express";
import { forgotPassword, allUsers, getUserProfile, logout, registerUser, resetPassword, updatePassword, updateProfile, getUserDetails, updateUser, deleteUser, uploadAvatar } from "../controllers/authController.js";
import { loginUser } from "../controllers/authController.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";


const router = express.Router();


router.post("/Register", registerUser)
router.post("/Login", loginUser)
router.get("/logout", logout)

router.post("/password/forgot", forgotPassword)

router.put("/password/reset/:token", resetPassword)
router.get("/getUserProfile", isAuthenticatedUser, getUserProfile)
router.put("/me/update_password", isAuthenticatedUser, updatePassword)
router.put("/me/update_profile", isAuthenticatedUser, updateProfile)
router.put('/me/upload_avatar', isAuthenticatedUser, uploadAvatar);
router.get("/getUserDetails/:id", isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
router.get("/allUsers", isAuthenticatedUser, authorizeRoles("admin"), allUsers)
router.put("/updateUserDetails/:id", isAuthenticatedUser, authorizeRoles("admin"), updateUser)
router.delete("/DeleteUser/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteUser)
export default router;