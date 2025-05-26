// scripts/insertTestData.js
import connectDB from './Connection.js';
import Product from '../models/Product.js';
import Featured from '../models/Featured.js';

async function insertTestData() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Insert realistic test products
    const testProducts = [
      {
        product_name: 'Wireless Bluetooth Headphones',
        price: 79.99,
        category: 'Electronics',
        img_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
      },
      {
        product_name: 'Organic Cotton T-Shirt',
        price: 29.99,
        category: 'Clothing',
        img_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop'
      },
      {
        product_name: 'JavaScript: The Good Parts',
        price: 24.99,
        category: 'Books',
        img_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop'
      },
      {
        product_name: 'Stainless Steel Water Bottle',
        price: 19.99,
        category: 'Home & Garden',
        img_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop'
      },
      {
        product_name: 'Yoga Mat Premium',
        price: 45.99,
        category: 'Sports',
        img_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop'
      },
      {
        product_name: 'Ceramic Coffee Mug',
        price: 12.99,
        category: 'Home & Garden',
        img_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=300&h=300&fit=crop'
      }
    ];

    // Clear existing data (optional - remove if you want to keep existing data)
    await Product.deleteMany({});
    await Featured.deleteMany({});

    // Insert products
    const insertedProducts = await Product.insertMany(testProducts);
    console.log(`Inserted ${insertedProducts.length} products`);

    // Make first three products featured
    const featuredEntries = [
      {
        product_id: insertedProducts[0]._id,
        priority: 1
      },
      {
        product_id: insertedProducts[1]._id,
        priority: 2
      },
      {
        product_id: insertedProducts[2]._id,
        priority: 3
      }
    ];

    await Featured.insertMany(featuredEntries);
    console.log(`Inserted ${featuredEntries.length} featured products`);

    console.log('Test data inserted successfully!');
    console.log('Products:', insertedProducts.map(p => ({ id: p._id, name: p.product_name })));
    console.log('Featured entries created for first 3 products');
    
    process.exit(0);
  } catch (error) {
    console.error('Error inserting test data:', error);
    process.exit(1);
  }
}

insertTestData();