import express from "express";
import { getSingleOrder, newOrder, myOrders, allOrders, updateOrder, deleteOrders } from "../controllers/orderController.js";
import { verifyAndCreateOrder } from "../controllers/orderController.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();
router.post("/order/new", isAuthenticatedUser, newOrder)
router.get("/me/orders", isAuthenticatedUser, myOrders)
router.get("/order/:id", isAuthenticatedUser, getSingleOrder)
router.get('/admin/orders/', isAuthenticatedUser, authorizeRoles('admin'), allOrders);
router.put('/admin/order/:id', isAuthenticatedUser, authorizeRoles('admin'), updateOrder);
router.delete('/admin/order/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteOrders);
// routes/payment.js (or wherever you verify payment)
router.post('/order/verify-and-create', isAuthenticatedUser, verifyAndCreateOrder);


export default router;