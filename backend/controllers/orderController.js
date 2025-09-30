import Order from "../model/order.js";
import { Product } from "../model/productModel.js";

import axios from 'axios';

// @desc    Create a new order
// @route   POST /api/order/new
// @access  Private
export const newOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No order items" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const order = await Order.create({
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      user: req.user._id,
      orderStatus: "Processing", // optional: default status
      paidAt: Date.now(),        // optional: mark as paid
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/me/orders
// @access  Private
export const myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single order
// @route   GET /api/order/:id
// @access  Private
export const getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No Order found with this ID',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin only)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const allOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email role");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order & reduce product stock (admin only)
// @route   PUT /api/admin/order/:id
// @access  Private/Admin
export const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No Order found with this ID',
      });
    }

    // Prevent re-updating an already delivered order (optional)
    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Order already delivered',
      });
    }

    // Update product stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);

      if (product) {
        product.stock = Math.max(product.stock - item.quantity, 0);
        await product.save({ validateBeforeSave: false });
      }
    }

    // Update order status
    order.orderStatus = 'Delivered';
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order delivered and stock updated",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an order (admin only)
// @route   DELETE /api/admin/order/:id
// @access  Private/Admin
export const deleteOrders = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No Order found with this ID',
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
// controllers/orderController.js



export const verifyAndCreateOrder = async (req, res, next) => {
  try {
    console.log("Received body:", req.body);

    const { tx_ref } = req.body;

    if (!tx_ref) {
      return res.status(400).json({ message: 'Missing tx_ref' });
    }

    // Verify with Chapa
    const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      },
    });

    const data = response.data.data;

    // OPTIONAL: Log for debugging
    console.log('Verified Chapa Payment:', data);
    

    if (data.status !== 'success') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    // Check if already created (prevent duplicate)
    const existingOrder = await Order.findOne({ tx_ref });
    if (existingOrder) {
      return res.status(200).json({ success: true, order: existingOrder });
    }

    // Create the order
    const order = await Order.create({
      user: req.user._id, // ✅ Make sure isAuthenticatedUser middleware sets req.user
      tx_ref,
      orderItems: req.body.orderItems || [],
    shippingInfo: data.shippingInfo
  ? {
      address: data.shippingInfo.address,
      city: data.shippingInfo.city,
      phoneNo: data.shippingInfo.phoneNo,
      postalCode: data.shippingInfo.postalCode,
      country: data.shippingInfo.country,
    }
  : {},
      totalPrice: data.amount,
    
      paidAt: new Date(),
      paymentInfo: {
        status: data.status,
        reference: data.reference,
        email: data.email,
      },
    });

    console.log('Created Order:', order._id); // ✅ should log like order_1752921756592

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Error verifying or saving order:', error.message);
    res.status(500).json({ message: 'Server error during order verification' });
  }
};

