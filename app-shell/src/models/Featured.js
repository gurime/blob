import mongoose from 'mongoose';

// Define the Featured schema
const featuredSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference by string name instead of model import
    required: true,
    index: true // Add index for better query performance
  },
  priority: {
    type: Number,
    default: 0,
    index: true // Add index for sorting
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true // Add index for sorting
  }
});

// Add compound index for efficient querying
featuredSchema.index({ priority: -1, created_at: -1 });

// Check if the model exists before compiling
const Featured = mongoose.models.Featured || mongoose.model('Featured', featuredSchema);

export default Featured;