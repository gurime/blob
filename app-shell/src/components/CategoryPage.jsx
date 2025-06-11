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
import { priceUtils } from '../utils/priceUtils';
import { auth } from '../db/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function CategoryPage() {
 const { category, subcategory, brand } = useParams(); // supports /:category/:subcategory/:brand
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Optional: format category name for display
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

  // Fetch products
  useEffect(() => {
   const fetchProducts = async () => {
  setLoading(true);
  setError(null);

  try {
    let colRef;

    if (category && subcategory && brand) {
      // 3-level nested: category / subcategory (as doc) / brand (as subcollection)
      colRef = collection(db, category, subcategory, brand);
    } else if (category && subcategory) {
      // 2-level nested: category / subcategory (as doc) / products (as subcollection)
      colRef = collection(db, category, subcategory, 'products');
    } else if (category) {
      // 1-level: just a flat collection
      colRef = collection(db, category); // must be a top-level collection like 'automotive'
    } else {
      throw new Error("Category not found");
    }

    const querySnapshot = await getDocs(colRef);

    const productsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setProducts(productsData);
  } catch (err) {
    console.error("Error fetching products:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


    fetchProducts();
  }, [category, subcategory, brand]);

  const formatPrice = (price) => {
    return priceUtils?.formatPrice ? priceUtils.formatPrice(price) : price.toFixed(2);
  };

  const handleAddToCart = (product) => {
    if (cartHandlers?.addToCart) {
      cartHandlers.addToCart(product, user);
    } else {
      console.log('Add to cart:', product);
    }
  };

  const handleBuyNow = (product) => {
    if (cartHandlers?.buyNow) {
      cartHandlers.buyNow(product, user);
    } else {
      console.log('Buy now:', product);
    }
  };
  const navigate = useNavigate();

  if (loading) {
    return (
      <>
        <Navbar />
        <SecNav />
        <div className="loading-container">
          <ClipLoader color="#FF9900" size={50} />
          <p>Loading {formatCategoryName(category, subcategory)} products...</p>
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
            <button  onClick={() => navigate(-1)}  className="no-page-button">← Go Back</button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <SecNav />
      <div className="container">
        <div className="category-header">
          <h1>{formatCategoryName(category, subcategory)}</h1>
          <p>{products.length} products found</p>
        </div>

        {products.length === 0 ? (
          <div className="no-products">
            <p>No products found in this category.</p>
            <button  onClick={() => navigate(-1)}  className="no-page-button">← Go Back</button>
          </div>
        ) : (
          <section className="category-products">
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="products-card">
                  <div className="product-image-container">
                    <img 
                      src={`/assets/images/${product.imgUrl}`} 
                      alt={product.product_name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = '/assets/images/default-product.jpg';
                      }}
                    />
                    <button className="wishlist-btn">♡</button>
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

                    <Link className="product-category" to={`/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}`}>
                      {formatCategoryName(category, subcategory)}
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
                      <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                        Add to Cart
                      </button>
                      <button className="buy-now-btn" onClick={() => handleBuyNow(product)}>
                        Buy Now 
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
        )}
      </div>
      <Footer />
    </>
  );
}
