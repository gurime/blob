//db/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Featured from '../models/Featured.js';
import connectDB from './Connection.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // React dev server
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// GET all products (basic endpoint)
app.get('/api/products', async (req, res) => {
  try {
    console.log('Fetching all products...');
    
    const products = await Product.find({})
      .sort({ created_at: -1 })
      .lean();
    
    console.log(`Found ${products.length} products`);
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

// GET featured products with all products - main endpoint for your React app
app.get('/api/products/featured', async (req, res) => {
  try {
    console.log('Fetching products and featured products...');
    
    // Get all products
    const allProducts = await Product.find({})
      .sort({ created_at: -1 })
      .lean();
    
    console.log(`Found ${allProducts.length} total products`);
    
    // Get featured products with populated product data
    const featuredEntries = await Featured.find({})
      .populate({
        path: 'product_id',
        select: '_id product_name price category img_url created_at'
      })
      .sort({ priority: -1, created_at: -1 })
      .lean();
    
    console.log(`Found ${featuredEntries.length} featured entries`);
    
    // Filter out null references and extract product data
    const validFeaturedProducts = featuredEntries
      .filter(fp => {
        if (!fp.product_id) {
          console.log('Found featured entry with null product_id:', fp._id);
          return false;
        }
        return true;
      })
      .map(fp => fp.product_id);
    
    console.log(`Valid featured products: ${validFeaturedProducts.length}`);
    
    const response = {
      products: allProducts || [],
      featuredProducts: validFeaturedProducts || [],
      metadata: {
        total: allProducts.length,
        featured: validFeaturedProducts.length,
        timestamp: new Date().toISOString()
      }
    };
    
    console.log('Sending response:', {
      productsCount: response.products.length,
      featuredCount: response.featuredProducts.length
    });
    
    res.json(response);
    
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({
      products: [],
      featuredProducts: [],
      error: 'Failed to fetch products',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// POST new product
app.post('/api/products', async (req, res) => {
  try {
    const { product_name, price, category, img_url } = req.body;
    
    // Basic validation
    if (!product_name || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'product_name, price, and category are required'
      });
    }
    
    const newProduct = new Product({
      product_name,
      price: parseFloat(price),
      category,
      img_url: img_url || ''
    });
    
    const savedProduct = await newProduct.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct
    });
    
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
      message: error.message
    });
  }
});

// POST add product to featured - Fixed route parameter
app.post('/api/products/featured/:productId([0-9a-fA-F]{24})', async (req, res) => {
  try {
    const productId = req.params.productId;
    const { priority = 0 } = req.body;
    
    // Validate ObjectId format
    if (!productId || !productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      });
    }
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Check if already featured
    const existingFeatured = await Featured.findOne({ product_id: productId });
    if (existingFeatured) {
      return res.status(400).json({
        success: false,
        error: 'Product is already featured'
      });
    }
    
    const newFeatured = new Featured({
      product_id: productId,
      priority: parseInt(priority)
    });
    
    const savedFeatured = await newFeatured.save();
    
    res.status(201).json({
      success: true,
      message: 'Product added to featured successfully',
      data: savedFeatured
    });
    
  } catch (error) {
    console.error('Error adding to featured:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add product to featured',
      message: error.message
    });
  }
});

// DELETE remove from featured - Fixed route parameter
app.delete('/api/products/featured/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    
    // Validate ObjectId format
    if (!productId || !productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      });
    }
    
    const deletedFeatured = await Featured.findOneAndDelete({ product_id: productId });
    
    if (!deletedFeatured) {
      return res.status(404).json({
        success: false,
        error: 'Featured product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product removed from featured successfully'
    });
    
  } catch (error) {
    console.error('Error removing from featured:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove product from featured',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

export default app;