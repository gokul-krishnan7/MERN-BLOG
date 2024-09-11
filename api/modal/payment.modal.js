import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String, required: true },
  razorpay_signature: { type: String, required: true },
  amount: { type: Number, required: true }, // Amount in paise
  status: { type: String, default: 'completed' }, // 'completed', 'failed'
  createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);
console.log(Payment)

export default Payment;
