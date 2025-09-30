import express from "express";
import { initializePayment, verifyPayment, webhookHandler  } from "../controllers/paymentController.js";
import { isAuthenticatedUser } from "../middleware/auth.js";
const router = express.Router();


router.post('/pay', initializePayment);
router.get('/verify/:tx_ref', verifyPayment);
router.post('/webhook', webhookHandler);


export default router;
