//api/products/index.js
import connectDB from "../../db/Connection";
import Product from "../../models/Product";
import Featured from "../../models/Featured";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      // Get all products with specific field selection and sorting
      const products = await Product.find({})
        .select('_id product_name price category img_url created_at')
        .sort({ created_at: -1 });
      
      // Get featured products with proper population and sorting
      const featuredEntries = await Featured.find({})
        .populate({
          path: 'product_id',
          select: '_id product_name price category img_url created_at'
        })
        .sort({ priority: -1 });

      // Filter out null references and map to clean product objects
      const featuredProducts = featuredEntries
        .filter(entry => entry.product_id !== null)
        .map(entry => entry.product_id);

      // Add debug logging
      console.log(`Found ${products.length} products and ${featuredProducts.length} featured products`);

      // Return structured response
      res.status(200).json({
        products,
        featuredProducts,
        metadata: {
          total: products.length,
          featured: featuredProducts.length,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ 
        error: 'Failed to fetch products',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
