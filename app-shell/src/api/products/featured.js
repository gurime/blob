import connectDB from "../../db/Connection";
import Featured from "../../models/Featured";

export default async function handler(req, res) {
  await connectDB();
  
  if (req.method === 'GET') {
    try {
      // Get featured products with populated product data
      const featuredProducts = await Featured.find({})
        .populate('product_id') // This gets the full product data
        .sort({ priority: 1 }); // Sort by priority
      
      // Extract just the product data
      const products = featuredProducts.map(fp => fp.product_id);
      
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      res.status(500).json({ error: 'Failed to fetch featured products' });
    }
  }
}