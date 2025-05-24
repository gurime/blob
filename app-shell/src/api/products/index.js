import connectDB from "../../db/Connection";
import Product from "../../models/Product";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const products = await Product.find({}).sort({ created_at: -1 });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }
}
