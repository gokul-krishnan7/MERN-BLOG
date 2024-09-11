import axios from 'axios';
import React, { useState } from 'react';

const Payment = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const cancelOrder = async () => {
    setLoading(true);
    try {
      // Call backend API to cancel the order
      const response = await axios.post('http://localhost:3000/api/payment/cancel-payment', {
        razorpay_order_id: "order_Ovi352t7DUnUll",
      });

      if (response.data.success) {
        alert('Order cancelled successfully');
      } else {
        alert('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Error cancelling order');
    } finally {
      setLoading(false);
    }
  };

  // Create order with backend
  const createOrder = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/payment/create-order', {
        amount: amount * 100, // Razorpay requires amount in paise
        currency: 'INR',
        receipt: 'receipt_id_' + Math.random(),
      });

      if (response.data.success) {
        // Open Razorpay payment UI
        openRazorpay(response.data.data);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to open Razorpay UI for payment
  const openRazorpay = (orderData) => {
    const options = {
      key: 'rzp_test_MA6P2DhPcEwvBa', // Use your Razorpay key
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Your Company',
      description: 'Test Transaction',
      order_id: orderData.id, // Razorpay order ID
      handler: async function (response) {
        try {
          // Capture payment after successful transaction
          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: orderData.amount,
          };
          await axios.post('http://localhost:3000/api/payment/capture-payment', paymentData);
          alert('Payment Successful!');
        } catch (error) {
          console.error('Error capturing payment:', error);
          alert('Payment Failed!');
        }
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div>
      <h2>Make a Payment</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={createOrder} disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
      <button onClick={cancelOrder}>cancel</button>
    </div>
  );
};

export default Payment;
