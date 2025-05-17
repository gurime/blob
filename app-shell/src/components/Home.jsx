import Navbar from './Navbar';
import Footer from './Footer';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('Fetching products...');
        
        const response = await fetch('http://localhost:5000/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // No need for custom headers that might trigger preflight requests
          },
        });
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Products fetched successfully:', data);
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <>
      <Navbar />
      <h1>Home</h1>
       <div>
      <h1>Products</h1>
      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <ul>
          {products.map((product, index) => (
            <li key={index}>{product.product_name}</li>
          ))}
        </ul>
      )}
    </div>
      <Footer />
    </>
  );
}
