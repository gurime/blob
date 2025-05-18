import express from 'express';
import connectDB from './Connection.js';

import Product from '../models/Product.js';

// Connect to the database
connectDB();

const app = express();
app.use(express.json());

// Sample route to create a product
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
