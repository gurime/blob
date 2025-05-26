import connectDB from "../../db/Connection";
import Featured from "../../models/Featured";
import Product from "../../models/Product";

export default async function handler(req, res) {
  // Set CORS headers if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      error: `Method ${req.method} not allowed`,
      message: 'Only GET requests are supported'
    });
  }

  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');

    console.log('Fetching all products...');
    const allProducts = await Product.find({})
      .sort({ created_at: -1 })
      .lean(); // Use lean() for better performance
    
    console.log(`Found ${allProducts.length} total products`);

    console.log('Fetching featured products...');
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

    return res.status(200).json(response);

  } catch (error) {
    console.error('Error in featured products API:', error);
    
    // Return a structured error response
    return res.status(500).json({
      products: [],
      featuredProducts: [],
      error: 'Failed to fetch products',
      message: error.message || 'Unknown server error',
      timestamp: new Date().toISOString()
    });
  }
}