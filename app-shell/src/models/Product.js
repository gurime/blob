// models/Product.js
import mongoose from 'mongoose';

// Define the Product schema
const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  img_url: {
    type: String,
    required: false,
    default: ''
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create and export the Product model
const Product = mongoose.model('Product', productSchema);

// Use ES Modules export syntax instead of CommonJS
export default Product;