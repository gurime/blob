import connectDB from "../../db/Connection";
import Product from "../../models/Product";

export default async function handler(req, res) {
  await connectDB();
  
  if (req.method === 'POST') {
    try {
      const { product_name, price, category, img_url } = req.body;
      
      const newProduct = new Product({
        product_name,
        price,
        category,
        img_url
      });
      
      await newProduct.save();
      res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}