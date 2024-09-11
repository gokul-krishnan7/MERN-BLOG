import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  receipt: {
    type: String,
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed', 'cancelled'],
    default: 'created',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
