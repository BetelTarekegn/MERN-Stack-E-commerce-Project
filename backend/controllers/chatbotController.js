// controllers/chatbotController.js
import { Product } from "../model/productModel.js";
import Order from "../model/order.js";
import ChatMessage from "../model/ChatMessage.js"; // create this model

export const productRecommendationChatbot = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?._id; // logged-in user

    if (!userId) {
      return res.status(401).json({ success: false, message: "Login required" });
    }

    // 1. Store user message
    const userMsg = await ChatMessage.create({
      userId,
      sender: "user",
      text: message,
    });

    let recommendations = [];

    // 2. Search products by keyword
    if (message) {
      recommendations = await Product.find({
        name: { $regex: message.trim(), $options: "i" },
      }).limit(5);
    }

    // 3. If not found, recommend based on last order
    if ((!recommendations || recommendations.length === 0)) {
      const userOrders = await Order.find({ user: userId }).populate(
        "orderItems.product"
      );

      if (userOrders.length > 0) {
        const lastOrder = userOrders[userOrders.length - 1];
        const lastCategory = lastOrder.orderItems[0]?.product?.category;

        if (lastCategory) {
          recommendations = await Product.find({
            category: lastCategory,
          }).limit(5);
        }
      }
    }

    // 4. Prepare bot message
    let botMessageText;
    if (!recommendations || recommendations.length === 0) {
      botMessageText = `❌ Sorry, the product '${message}' is not available in our e-commerce website. Please try another item.`;
    } else {
      botMessageText = `✅ Here are some recommendations for '${message}':  

🛒 Welcome to our e-commerce website!  
✨ We provide:
- High-quality products at affordable prices  
- Secure payments powered by **Chapa**  
- Fast & reliable delivery to your doorstep  
- 24/7 customer support for your convenience  
- Exclusive discounts and seasonal sales 🎉  

Start shopping today and enjoy a smooth, safe, and exciting experience! 🚀`;
    }

    // 5. Store bot message
    const botMsg = await ChatMessage.create({
      userId,
      sender: "bot",
      text: botMessageText,
      products: recommendations,
    });

    res.status(200).json({
      success: true,
      botMessage: botMessageText,
      recommendations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
