import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import ProductRouter from "./routers/productrouters.js";
import authRouter from "./routers/userRouter.js";
import orderRouter from "./routers/order.js"
import connectDatabase from "./config/db.js";
import paymentRouter from "./routers/paymentrouters.js";
import chatbotRoutes from "./routers/chatbotRoutes.js";



const app = express();



dotenv.config();
const PORT = process.env.PORT || 3000;
connectDatabase();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use("/api", ProductRouter);
app.use("/api", authRouter);
app.use("/api", orderRouter);
app.use("/api", paymentRouter);
app.use("/api", chatbotRoutes);



//Error Handling method
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err); // Let default Express error handler handle it
    }

    res.status(500).json({ message: err.message });
});


app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server is start on port ${PORT}`)
})