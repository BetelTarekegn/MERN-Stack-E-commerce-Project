// routes/chatbotRoutes.js
import express from "express";
import { isAuthenticatedUser } from "../middleware/auth.js"; 
import { productRecommendationChatbot } from "../controllers/chatbotController.js";

const router = express.Router();

router.post("/chatbot", isAuthenticatedUser, productRecommendationChatbot);

export default router;
