/* eslint-disable no-unused-vars */
import Navbar from './Navbar';
import Footer from './Footer';
import {getDocs, collection } from 'firebase/firestore';
import { db } from '../db/firebase';
import { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { Link, useNavigate } from 'react-router-dom';
import DeliveryInfo from './DeliveryInfo'; 
import ProductRating from './ProductRating';
import { cartHandlers } from '../utils/cartHandlers';
import { priceUtils } from '../utils/priceUtils';
import { wishlistHandlers } from '../utils/wishlistHandler'; // Import wishlist handlers
import { auth } from '../db/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import SecNav from './SecNav';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState(new Set()); // Track wishlisted items
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
 const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUserLoading(false);
      
      // Load user's wishlist when user changes
      if (currentUser) {
        loadUserWishlist(currentUser.uid);
      } else {
        setWishlistItems(new Set());
      }
    });
    return () => unsubscribe();
  }, []);

  // Load user's wishlist
  const loadUserWishlist = async (userId) => {
    try {
      const result = await wishlistHandlers.getUserWishlist(userId);
      if (result.success) {
        const wishlistProductIds = new Set(
          result.wishlist.map(item => item.productId)
        );
        setWishlistItems(wishlistProductIds);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (product) => {
    if (!user) {
      alert('Please log in to add items to your wishlist');
      return;
    }

    setWishlistLoading(true);
    try {
      const result = await wishlistHandlers.toggleWishlist(user.uid, product);
      
      if (result.success) {
        const productId = product.id || product._id;
        const newWishlistItems = new Set(wishlistItems);
        
        if (newWishlistItems.has(productId)) {
          newWishlistItems.delete(productId);
        } else {
          newWishlistItems.add(productId);
        }
        
        setWishlistItems(newWishlistItems);
        
        // Optional: Show success message
        console.log(result.message);
      } else {
        alert(result.message || 'Error updating wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Error updating wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

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
      const interval = setInterval(nextSlide, 10000);
      return () => clearInterval(interval);
    }
  }, [featuredProducts.length]);

  const handleCartButtonClick = async (product) => {
  const result = await cartHandlers.handleAddToCart(product, 1, showToast);
  
  if (result.success && result.shouldNavigate) {
    // Navigate to cart page after successful addition
    setTimeout(() => {
      navigate('/cart');
    }, 1000); // Small delay to show the toast first
  }
};

  if (loading || userLoading) {
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

  const { handleAddToCart, handleBuyNow } = cartHandlers;
  const { formatPrice, generateOriginalPrice, calculateSavings } = priceUtils;
  
  return (
    <>
      <Navbar />
      <SecNav/>
      <div className="container">

        {/* Featured Products Carousel Section */}
        <section className="featured-products">
          <h2>Today&#39;s Deals</h2>
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
                        <ProductRating
                          rating={product.rating || 0}
                          totalReviews={product.totalReviews || 0}
                          isInteractive={true}
                          productId={product._id}
                          userId={user?.uid || null}
                          showLink={true}
                        />
                        <div className="price-section">
                          <span className="current-price">${formatPrice(product.price)}</span>
                          <span className="original-price">${generateOriginalPrice(product.price)}</span>
                          <span className="discount">
                            {calculateSavings(product.price, generateOriginalPrice(product.price).replace(/,/g, '')).percentage}% off
                          </span>
                          <Link to={`/product/${product._id}`} className="view-details">
                            View Details
                          </Link>
                        </div>
                        <span className="category-tag">{product.category}</span>
                        <div className="product-description">{product.description}</div>
                        
                        <div className="prime-badge">
                          <img className="prime-logo" src={`/assets/images/${product.gpremium}`} alt="Prime" />
                        </div>
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
                  {/* Updated wishlist button */}
<button 
className={`wishlist-btn ${wishlistItems.has(product.id) ? 'wishlisted' : ''}`}
                    onClick={() => handleWishlistToggle(product)}
                    disabled={wishlistLoading}
                    title={wishlistItems.has(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    {wishlistItems.has(product.id) ? '♥' : '♡'}
                  </button>
                  {product.bestseller && <div className="bestseller-badge">#1 Best Seller</div>}
                  {product.deal && <div className="deal-badge">Limited time deal</div>}
                </div>
                
                <div className="product-content">
                  <h2 className="product-name">{product.product_name}</h2>
                  
                  <ProductRating
                    rating={product.rating || 0}
                    totalReviews={product.totalReviews || 0}
                    isInteractive={true}
                    productId={product.id}
                    userId={user?.uid || null}
                    showLink={true}
                  />
                  
                  <Link className="product-category" to={`/category/${encodeURIComponent(product.category)}`}>
                    {product.category}
                  </Link>
                  <p className="product-description">{product.description}</p>

                  <div className="price-container">
                    <span className="product-price">${formatPrice(product.price)}</span>
                    {product.prime && (
                      <div className="prime-shipping">
                        <span className="prime-badge-small">Prime</span>
                        <span className="free-shipping">FREE delivery</span>
                      </div>
                    )}
                  </div>
                  
                  <DeliveryInfo hasPremium={!!product?.gpremium} />
                  
                  <div className="product-actions">
                    <button 
  className="add-to-cart-btn" 
  onClick={() => handleCartButtonClick(product)}
>
  Add to Cart
</button>
                    {/* <button className="buy-now-btn" onClick={handleBuyNow}>
                      Buy Now 
                    </button> */}
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
            {/* Toast Notification */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {toast.type === 'success' ? '✓' : '✕'}
            </span>
            <span className="toast-message">{toast.message}</span>
            <button 
              className="toast-close"
              onClick={() => setToast({ show: false, message: '', type: '' })}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}