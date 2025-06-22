// Add this to your backend alongside the existing checkout session endpoint
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, orderData, deliveryOption, deliveryFee } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency || 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: orderData.id,
        deliveryOption: deliveryOption,
        deliveryFee: deliveryFee.toString(),
        totalItems: orderData.summary.totalItems.toString(),
      },
      description: `Order #${orderData.id} - ${orderData.summary.totalItems} items`,
    });

    res.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(400).json({ error: error.message });
  }
});