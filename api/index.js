import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import AUthRoutes from '../api/route/auth.route.js';
import UserRoutes from '../api/route/user.route.js';
import Order from './modal/order.modal.js';
import Payment from './modal/payment.modal.js';

dotenv.config(); // Install dotenv and import it, then use dotenv.config()

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
  allowedHeaders: ['Content-Type'], // Allow specific headers
}));

// MongoDB connection
mongoose
  .connect(process.env.MANGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((error) => {
    console.log(error.message);
  });

app.use(bodyParser.json());

// Initialize Razorpay instance
const razorpay = new Razorpay({
   key_id: 'rzp_test_MA6P2DhPcEwvBa',
  key_secret: 'EyefqItMIWyYQn3VliTL4x2s'
});

// Routes
app.use("/api/user", UserRoutes);
app.use("/api/auth", AUthRoutes);

// Route to create an order
app.post('/api/payment/create-order', async (req, res) => {
  const { amount, currency, receipt } = req.body;

  try {
    // Create order with Razorpay
    const response = await razorpay.orders.create({
      amount, // Amount in paise
      currency,
      receipt,
    });

    // Save the order to MongoDB
    const order = new Order({
      razorpay_order_id: response.id,
      amount,
      currency,
      receipt,
      status: 'created',
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order created successfully',
      data: response,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
 
});

// Route to capture payment
app.post('/api/payment/capture-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

  try {
    // Save payment data to MongoDB
    const payment = new Payment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      status: 'paid',
    });

    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment processed and saved successfully',
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ success: false, message: 'Failed to process payment' });
  }
});

// Route to cancel an order
app.post('/api/payment/cancel-payment', async (req, res) => {
  const { razorpay_order_id } = req.body;

  try {
    // Update order status to 'cancelled'
    const order = await Order.findOneAndUpdate(
      { razorpay_order_id },
      { status: 'cancelled' }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start the server on a dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
