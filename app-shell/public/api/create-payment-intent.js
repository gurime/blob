import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
});

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(cors());
app.use(express.json());

// Your payment intent endpoint
// Payment intent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', orderData, deliveryOption, deliveryFee } = req.body;

    if (!amount || isNaN(amount) || !orderData?.id || !orderData?.summary?.totalItems) {
      return res.status(400).json({ error: 'Invalid payment request data' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderId: orderData.id,
        deliveryOption,
        deliveryFee: deliveryFee?.toString() || '0',
        totalItems: orderData.summary.totalItems.toString(),
      },
      description: `Order #${orderData.id} - ${orderData.summary.totalItems} items`,
    });

    res.status(200).json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ error: error.message });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
