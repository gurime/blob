import express from 'express';
import connectDB from './Connection.js';
import Product from '../models/Product.js';
import Featured from '../models/Featured.js';

// Connect to the database
connectDB();

const app = express();
app.use(express.json());

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    console.log(`Found ${products.length} products in database`);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Create a product (with enhanced error handling)
app.post('/api/products', async (req, res) => {
  try {
    console.log('Received product data:', req.body);
    
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    
    console.log('Product saved successfully:', savedProduct);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.log('Validation error:', error.message);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors 
      });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

app.get('/api/products/featured', async (req, res) => {
  try {
    // Find all featured entries, sorted by priority and creation time
    const featuredEntries = await Featured.find({})
      .sort({ priority: -1, created_at: -1 })
      .populate('product_id'); // Populate full product details

    // Map to extract just the populated product objects
    const featuredProducts = featuredEntries
      .map(entry => entry.product_id)
      .filter(product => product !== null); // filter out any broken references

    res.json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: error.message });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});