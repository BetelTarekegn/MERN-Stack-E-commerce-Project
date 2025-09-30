import { deletedProduct, getProducts, updatedProduct,createProductReview,getProductReviews,deleteReview, getAdminProducts,deleteProductImage, uploadProductImages } from "../controllers/productcontrollers.js";
import { newProduct } from "../controllers/productcontrollers.js";
import { getProductDetails } from "../controllers/productcontrollers.js";
import express from "express";
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';
const router = express.Router();



router.get("/Products", getProducts)
router.post("/admin/Products", isAuthenticatedUser, authorizeRoles("admin"), newProduct)
router.get("/admin/Products", isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts)
router.get("/Products/:id", getProductDetails)
router.put("/admin/Products/:id", isAuthenticatedUser, authorizeRoles("admin"), updatedProduct)
router.put("/admin/Products/:id/upload_images", isAuthenticatedUser, authorizeRoles("admin"), uploadProductImages)
router.delete ("/admin/Products/:id/delete_image", isAuthenticatedUser, authorizeRoles("admin"), deleteProductImage)
router.delete("/admin/Products/:id", isAuthenticatedUser, authorizeRoles("admin"), deletedProduct)
router.put("/reviews", isAuthenticatedUser, createProductReview)
router.get("/reviews",isAuthenticatedUser, getProductReviews)
router.delete("/admin/reviews",isAuthenticatedUser,authorizeRoles("admin"), deleteReview)
export default router;