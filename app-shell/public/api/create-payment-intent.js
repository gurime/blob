app.post('http://localhost:5173/api/create-payment-intent', async (req, res) => {
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
      // receipt_email: orderData?.customer?.email || undefined,
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
