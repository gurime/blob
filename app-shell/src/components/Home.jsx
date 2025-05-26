import Navbar from './Navbar';
import axios from 'axios';
import Footer from './Footer';
import { useEffect, useState, useCallback } from 'react';
import ProductCard from './ProductCard';
import BounceLoader from 'react-spinners/BounceLoader';

// Configure axios base URL for your Express server
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching products from:', `${API_BASE_URL}/api/products/featured`);
      
      // Add timeout to prevent hanging requests
      const response = await axios.get(`${API_BASE_URL}/api/products/featured`, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Response received:', response.data);
      
      // Validate response structure
      if (!response.data) {
        throw new Error('No data received from server');
      }

      const { products: allProducts = [], featuredProducts: featured = [] } = response.data;
      
      // Ensure we have arrays
      if (!Array.isArray(allProducts) || !Array.isArray(featured)) {
        throw new Error('Invalid data format received from server');
      }
      
      console.log(`Setting ${allProducts.length} products and ${featured.length} featured products`);
      
      setProducts(allProducts);
      setFeaturedProducts(featured);
      setRetryCount(0); // Reset retry count on success
      
    } catch (error) {
      console.error('Error fetching products:', error);
      
      let errorMessage = 'Unknown error occurred';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - please try again';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error - is your server running on port 5000?';
      } else if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;
        
        if (status === 500) {
          errorMessage = serverMessage || 'Server error - please try again later';
        } else if (status === 404) {
          errorMessage = 'API endpoint not found - check server configuration';
        } else if (status === 405) {
          errorMessage = 'Method not allowed';
        } else {
          errorMessage = `Server error (${status}): ${serverMessage || 'Unknown error'}`;
        }
      } else if (error.request) {
        // Request made but no response received
        errorMessage = 'Cannot connect to server - make sure Express server is running on port 5000';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      // Set empty arrays as fallback
      setProducts([]);
      setFeaturedProducts([]);
      
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    fetchProducts();
  }, [fetchProducts]);

  // Test server connection
  const testServerConnection = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/health`, { timeout: 5000 });
      console.log('Server health check:', response.data);
      return true;
    } catch (error) {
      console.error('Server health check failed:', error.message);
      return false;
    }
  }, []);

  useEffect(() => {
    // Test server connection first, then fetch products
    const initializeData = async () => {
      const serverOk = await testServerConnection();
      if (serverOk) {
        fetchProducts();
      } else {
        setError('Cannot connect to server - make sure your Express server is running');
        setLoading(false);
      }
    };

    initializeData();
  }, [fetchProducts, testServerConnection]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column'
        }}>
          <BounceLoader color="#007bff" size={60} />
          <p style={{ marginTop: '20px', color: '#666' }}>Loading products...</p>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#999' }}>
            Connecting to server at {API_BASE_URL}
          </p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="error-container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #f5c6cb',
            maxWidth: '600px'
          }}>
            <h3>Error Loading Products</h3>
            <p style={{ margin: '10px 0' }}>{error}</p>
            <div style={{ marginTop: '15px', fontSize: '14px', color: '#856404', backgroundColor: '#fff3cd', padding: '10px', borderRadius: '4px' }}>
              <strong>Server Setup:</strong>
              <br />• Make sure your Express server is running: <code>npm run server</code>
              <br />• Server should be available at: <strong>{API_BASE_URL}</strong>
              <br />• Check MongoDB connection in server logs
            </div>
            {retryCount > 0 && (
              <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '10px' }}>
                Retry attempt: {retryCount}
              </p>
            )}
            <button 
              onClick={handleRetry}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '15px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              Retry Connection
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <h1 className="hero-title">Welcome to Our Store</h1>
            <p className="hero-subtitle">
              Discover amazing products at unbeatable prices
            </p>
            <button className="hero-button">Shop Now</button>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="featured-section">
          <div className="container">
            <h2 className="section-title">Featured Products</h2>
            <div className="featured-grid">
              {featuredProducts && featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <ProductCard 
                    key={product._id || product.id} 
                    product={product} 
                    featured={true} 
                  />
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <p>No featured products available at the moment.</p>
                  <p style={{ fontSize: '14px', marginTop: '10px' }}>
                    Add products to featured in your database to see them here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* All Products Section */}
        <section className="products-section">
          <div className="container">
            <h2 className="section-title">All Products</h2>
            <div className="products-grid">
              {products && products.length > 0 ? (
                products.map((product) => (
                  <ProductCard 
                    key={product._id || product.id} 
                    product={product} 
                  />
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <p>No products available at the moment.</p>
                  <p style={{ fontSize: '14px', marginTop: '10px' }}>
                    Add products to your database to see them here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}