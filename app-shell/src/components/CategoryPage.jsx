/* eslint-disable no-unused-vars */
import React from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../db/firebase";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import ClipLoader from 'react-spinners/ClipLoader';
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import Footer from "./Footer";
import SecNav from "./SecNav";
import ProductRating from './ProductRating';
import DeliveryInfo from './DeliveryInfo';
import { cartHandlers } from '../utils/cartHandlers';
import { wishlistHandlers } from '../utils/wishlistHandler';
import { priceUtils } from '../utils/priceUtils';
import { auth } from '../db/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function CategoryPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [wishlistLoading, setWishlistLoading] = useState(false);
  
  // New state for filters and sorting
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
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

  const productsPerPage = 16;
 const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };

  // Determine category structure based on URL pattern
  const getCategoryInfo = useCallback(() => {
    const pathname = location.pathname;
    
    if (pathname.startsWith('/category/')) {
      return {
        category: params.category,
        subcategory: params.subcategory,
        subsubcategory: params.subsubcategory
      };
    } else {
      const pathSegments = pathname.split('/').filter(Boolean);
      return {
        category: pathSegments[0],
        subcategory: params.subcategory,
        subsubcategory: params.subsubcategory
      };
    }
  }, [params, location.pathname]);

  // Format category name for display
  const formatCategoryName = useCallback((...parts) => {
    return parts
      .filter(Boolean)
      .map((part) =>
        part.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      )
      .join(" / ");
  }, []);

  // Set user on auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch products based on category structure
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const { category, subcategory, subsubcategory } = getCategoryInfo();
        
        if (!category) {
          throw new Error("Category not found");
        }

        let colRef;
        let productsData = [];


        if (category && subcategory && subsubcategory) {
          colRef = collection(db, category, subcategory, subsubcategory, 'products');
        } else if (category && subcategory) {
          colRef = collection(db, category, subcategory, 'products');
        } else if (category) {
          try {
            colRef = collection(db, category);
            const querySnapshot = await getDocs(colRef);
            
            if (!querySnapshot.empty) {
              const firstDoc = querySnapshot.docs[0];
              const data = firstDoc.data();
              
              if (data.product_name || data.price || data.description) {
                productsData = querySnapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));
              } else {
                for (const doc of querySnapshot.docs) {
                  try {
                    const subColRef = collection(db, category, doc.id, 'products');
                    const subSnapshot = await getDocs(subColRef);
                    const subProducts = subSnapshot.docs.map((subDoc) => ({
                      id: subDoc.id,
                      subcategory: doc.id,
                      ...subDoc.data(),
                    }));
                    productsData.push(...subProducts);
                  } catch (subError) { /* empty */ }
                }
              }
            }
          } catch (directError) {
            throw new Error(`Category "${category}" not found`);
          }
        }

        if (productsData.length === 0 && colRef) {
          const querySnapshot = await getDocs(colRef);
          productsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }

        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.pathname, getCategoryInfo]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Apply price filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(product => {
        const price = product.price;
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Apply brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        selectedBrands.includes(product.brand || 'Unknown')
      );
    }

    // Apply rating filter
    if (selectedRatings.length > 0) {
      filtered = filtered.filter(product => {
        const rating = product.rating || 0;
        return selectedRatings.some(minRating => rating >= minRating);
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
        break;
      default: // featured
        filtered.sort((a, b) => {
          if (a.bestseller && !b.bestseller) return -1;
          if (!a.bestseller && b.bestseller) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, sortBy, priceRange, selectedBrands, selectedRatings]);

  // Get unique brands from products
  const availableBrands = [...new Set(products.map(p => p.brand || 'Unknown'))].sort();

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const formatPrice = (price) => {
    return priceUtils?.formatPrice ? priceUtils.formatPrice(price) : price.toFixed(2);
  };



  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleRatingChange = (rating) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSelectedBrands([]);
    setSelectedRatings([]);
    setSortBy('featured');
  };

  const { category, subcategory, subsubcategory } = getCategoryInfo();

  const breadcrumbItems = [
  { name: "Home", to: "/" },
  category && { name: formatCategoryName(category), to: `/category/${encodeURIComponent(category)}` },
  subcategory && { name: formatCategoryName(subcategory), to: `/category/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}` },
  subsubcategory && { name: formatCategoryName(subsubcategory), to: `/category/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}/${encodeURIComponent(subsubcategory)}` }
].filter(Boolean);

  const handleCartButtonClick = async (product) => {
  const result = await cartHandlers.handleAddToCart(product, 1, showToast);
  
  if (result.success && result.shouldNavigate) {
    // Navigate to cart page after successful addition
    setTimeout(() => {
      navigate('/cart');
    }, 1000); // Small delay to show the toast first
  }
};

  if (loading) {
    return (
      <>
        <Navbar />
        <SecNav />
        <div className="loading-container">
          <ClipLoader color="#FF9900" size={50} />
          <p>Loading {formatCategoryName(category, subcategory, subsubcategory)} products...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <SecNav />
        <div className="error-container">
          <p>Error loading products: {error}</p>
          <button onClick={() => navigate(-1)} className="no-page-button">← Go Back</button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <SecNav />
      <div className="category-page-container">
        {/* Breadcrumb */}
{/* Breadcrumb */}
<div className="breadcrumb">
  {breadcrumbItems.map((item, idx) => (
    <React.Fragment key={item.to}>
      <Link to={item.to}>{item.name}</Link>
      {idx < breadcrumbItems.length - 1 && (
        <span className="breadcrumb-separator">›</span>
      )}
    </React.Fragment>
  ))}
</div>

        {/* Category Header */}
        <div className="category-header">
          <h1>{formatCategoryName(category, subcategory, subsubcategory)}</h1>
          <p className="results-count">
            {filteredProducts.length > 0 
              ? `1-${Math.min(productsPerPage, filteredProducts.length)} of ${filteredProducts.length} results`
              : 'No results found'
            }
          </p>
        </div>

        {products.length === 0 ? (
          <div className="no-products">
            <p>No products found in this category.</p>
            <button onClick={() => navigate(-1)} className="no-page-button">← Go Back</button>
          </div>
        ) : (
          <div className="category-content">
            {/* Sidebar Filters */}
            <aside className={`filters-sidebar ${showFilters ? 'show-mobile' : ''}`}>
              <div className="filters-header">
                <h3>Filters</h3>
                <button 
                  className="clear-filters-btn" 
                  onClick={clearFilters}
                  disabled={!priceRange.min && !priceRange.max && selectedBrands.length === 0 && selectedRatings.length === 0}
                >
                  Clear All
                </button>
              </div>

              {/* Price Range Filter */}
              <div className="filter-group">
                <h4>Price</h4>
                <div className="price-range-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="price-input"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="price-input"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              {availableBrands.length > 1 && (
                <div className="filter-group">
                  <h4>Brand</h4>
                  <div className="checkbox-list">
                    {availableBrands.slice(0, 10).map(brand => (
                      <label key={brand} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                        />
                        <span>{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating Filter */}
              <div className="filter-group">
                <h4>Customer Reviews</h4>
                <div className="rating-filters">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedRatings.includes(rating)}
                        onChange={() => handleRatingChange(rating)}
                      />
                      <span className="rating-filter-text">
                        {'★'.repeat(rating)}{'☆'.repeat(5-rating)} & Up
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="products-main">
              {/* Sort and View Controls */}
              <div className="controls-bar">
                <div className="sort-controls">
                  <button 
                    className="filters-toggle-btn mobile-only"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    Filters {showFilters ? '−' : '+'}
                  </button>
                  
                  <label htmlFor="sort-select">Sort by:</label>
                  <select 
                    id="sort-select"
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Avg. Customer Review</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>

                <div className="view-controls">
                  <button 
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    ⊞
                  </button>
                  <button 
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    ☰
                  </button>
                </div>
              </div>

              {/* Products Grid/List */}
              <section className={`products-gtrid products-${viewMode}`}>
                <div className={`products-${viewMode}`}>
                  {currentProducts.map(product => (
                   <div key={product.id} className="products-card">
                <div className="product-image-container">
                  <img 
                    src={`/assets/images/${product.imgUrl}`} 
                    alt={product.product_name}
                    className="product-image"
                  />
<button 
className={`wishlist-btn ${wishlistItems.has(product.id) ? 'wishlisted' : ''}`}
                    onClick={() => handleWishlistToggle(product)}
                    disabled={wishlistLoading}
                    title={wishlistItems.has(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    {wishlistItems.has(product.id) ? '♥' : '♡'}
                  </button>{product.bestseller && <div className="bestseller-badge">#1 Best Seller</div>}
                  {product.deal && <div className="deal-badge">Limited time deal</div>}
                </div>
                
                <div className="product-content">
                  <h2 className="product-name">{product.product_name}</h2>
                  
                  <ProductRating
                    rating={product.rating || 0}
                    totalReviews={product.totalReviews || 0}
                    isInteractive={true}  // Enable clicking
                    productId={product.id} // Pass the product ID
                    userId={user?.uid || null} // Pass current user ID safely
                    showLink={true} // Show link to reviews
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
                  
                  {/* Add DeliveryInfo component here, right after price */}
<DeliveryInfo  hasPremium={!!product?.gpremium} />
                  
                  <div className="product-actions">
                    <button className="add-to-cart-btn" 
                     onClick={() => handleCartButtonClick(product)}
>
                      Add to Cart
                    </button>

<button style={{ width: '100%' }}
onClick={() => navigate('/')} 
className="continue-shopping-btn"
>
Continue Shopping
</button> 
                  </div>
                  
                  <Link to={`/product/${product.id}`} className="view-details">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
              </section>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  
                  <div className="page-numbers">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </main>
          </div>
        )}
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