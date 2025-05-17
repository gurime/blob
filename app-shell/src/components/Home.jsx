import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

// Create axios instance with debug interceptors
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('Starting Request:', request.url);
  return request;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('Response:', response.status);
    return response;
  },
  error => {
    console.error('Response Error:', error.message);
    return Promise.reject(error);
  }
);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(
          err.response?.data?.message || 
          err.message || 
          'Failed to fetch products'
        );
        setProducts([]);
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
        <h2>Products</h2>
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          <ul>
            {products.map((product, index) => (
              <li key={product.id || index}>{product.product_name}</li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
}