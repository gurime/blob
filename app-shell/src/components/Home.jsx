import Navbar from './Navbar';
import Footer from './Footer';
import {getDocs, collection } from 'firebase/firestore';
import { db } from '../db/firebase';
import { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { Link } from 'react-router-dom';
import DeliveryInfo from './DeliveryInfo'; // Add this import

export default function Home() {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'featuredProducts'));
        const featuredProductList = querySnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        setFeaturedProducts(featuredProductList);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsList);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prev => 
      prev >= featuredProducts.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide(prev => 
      prev <= 0 ? featuredProducts.length - 1 : prev - 1
    );
  };

  // Auto-slide functionality
  useEffect(() => {
    if (featuredProducts.length > 0) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredProducts.length]);


  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <ClipLoader color="#FF9900" size={50} />
          <p>Loading amazing products...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>Error: {error}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">

        {/* Featured Products Carousel Section */}
        <section className="featured-products">
          <h2>Today's Deals & Featured Products</h2>
          <div className="carousel-container">
            <button className="carousel-btn prev-btn" onClick={prevSlide}>
              &#8249;
            </button>
            <div className="carousel-wrapper">
              <div 
                className="carousel-track"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredProducts.map((product, index) => (
                  <div key={product._id} className="carousel-slide">
                    <div className="featured-card">
                      <div className="product-badge">{product.Deal} </div>
                      <img 
                    src={`/assets/images/${product.imgUrl}`} 
                        alt={product.product_name}
                        className="featured-image"
                      />
                      <div className="featured-content">
                        <h3 className="product-title">{product.product_name}</h3>
                        <div className="rating-section">
                          <div className="stars">★★★★☆</div>
                          <span className="review-count">(1,234)</span>
                        </div>
                        <div className="price-section">
                          <span className="current-price">${product.price}</span>
                          <span className="original-price">${(product.price * 1.3).toFixed(2)}</span>
                          <span className="discount">23% off</span>
                          <Link to={`/product/${product._id}`} className="view-details">
                            View Details
                          </Link>
                        </div>
                        <span className="category-tag">{product.category}</span>
                        <div className="prime-badge">
                          <img className="prime-logo" src={`/assets/images/${product.gpremium}`} alt="Prime" />
                        </div>
                        {/* Add DeliveryInfo component here */}
                        <DeliveryInfo hasPremium={!!product.gpremium} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="carousel-btn next-btn" onClick={nextSlide}>
              &#8250;
            </button>
          </div>
          <div className="carousel-dots">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </section>

        {/* All Products Section */}
        <section className="all-products">
          <h2>All Products</h2>
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="products-card">
                <div className="product-image-container">
                  <img 
                    src={`/assets/images/${product.imgUrl}`} 
                    alt={product.product_name}
                    className="product-image"
                  />
                  <button className="wishlist-btn">♡</button>
                  {product.bestseller && <div className="bestseller-badge">#1 Best Seller</div>}
                  {product.deal && <div className="deal-badge">Limited time deal</div>}
                </div>
                
                <div className="product-content">
                  <h2 className="product-name">{product.product_name}</h2>
                  
                  <div className="rating-section">
                    <div className="stars">★★★★☆</div>
                    <span className="review-count">(567)</span>
                  </div>
                  
                  <h3 className="product-category">{product.category}</h3>
                  <p className="product-description">{product.description}</p>
                  
                  <div className="price-container">
                    <span className="product-price">${product.price}</span>
                    {product.prime && (
                      <div className="prime-shipping">
                        <span className="prime-badge-small">Prime</span>
                        <span className="free-shipping">FREE delivery</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Add DeliveryInfo component here, right after price */}
                  <DeliveryInfo hasPremium={!!product.prime} />
                  
                  <div className="product-actions">
                    <button className="add-to-cart-btn">Add to Cart</button>
                    <button className="buy-now-btn">Buy Now</button>
                  </div>
                  
                  <Link to={`/product/${product.id}`} className="view-details">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}