/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Payment intent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
try {
const { 
amount, 
currency = 'usd', 
orderData, 
deliveryOption, 
deliveryFee,
customer_name,
customer_email,
customer_phone,
address,
city,
state,
zip
} = req.body;

    // Validation
if (!amount || isNaN(amount) || amount <= 0) {
return res.status(400).json({ error: 'Invalid amount' });
}

if (!orderData?.id) {
return res.status(400).json({ error: 'Order ID is required' });
}

// Create payment intent with explicit payment method types
const paymentIntent = await stripe.paymentIntents.create({
amount,
currency,
// FIXED: Use explicit payment method types instead of automatic_payment_methods
payment_method_types: ['card'],
      
      // Optional: Add customer information
...(customer_email && { receipt_email: customer_email }),
      
      // Add shipping information if provided
...(customer_name && address && {
shipping: {
name: customer_name,
address: {
line1: address,
city: city,
state: state,
postal_code: zip,
country: 'US',
},
},
}),
      
metadata: {
orderId: orderData.id,
deliveryOption: deliveryOption || 'standard',
deliveryFee: deliveryFee?.toString() || '0',
totalItems: (orderData.summary?.totalItems || orderData.items?.length || 0).toString(),
customerName: customer_name || '',
customerEmail: customer_email || '',
customerPhone: customer_phone || '',
address: address || '',
city: city || '',
state: state || '',
zip: zip || '',
},
description: `Order #${orderData.id} - ${orderData.summary?.totalItems || orderData.items?.length || 0} items`,
});

console.log(`Payment Intent created: ${paymentIntent.id} for amount: $${amount/100}`);
res.status(200).json({
client_secret: paymentIntent.client_secret,
payment_intent_id: paymentIntent.id,
});

} catch (error) {
console.error('Payment intent creation error:', error);
// Return specific error information
res.status(400).json({
error: error.message,
type: error.type || 'unknown_error',
code: error.code || 'unknown_code'
});
}
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Test endpoint to verify Stripe connection
app.get('/api/test-stripe', async (req, res) => {
try {
const paymentMethods = await stripe.paymentMethods.list({
type: 'card',
limit: 1,
});
res.status(200).json({ 
message: 'Stripe connection successful',
stripe_version: stripe.VERSION 
});
} catch (error) {
res.status(500).json({ 
error: 'Stripe connection failed', 
details: error.message 
});
}
});

// Error handling middleware
app.use((error, req, res, next) => {
res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
console.log(`Health check: http://localhost:${PORT}/health`);
console.log(`Stripe test: http://localhost:${PORT}/api/test-stripe`);
});