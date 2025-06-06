import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ClipLoader from "react-spinners/ClipLoader";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../db/firebase";
import gulimepremium from "/assets/images/gulimepremium.png";
export default function Details() {   
  const params = useParams();
  
  let { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Scroll to top when component mounts
    
    const fetchProduct = async () => {
      try {
        const collections = ['products', 'featuredProducts', 'Technology', 'featuredTechnology'];
        let productData = null;
        let foundCollection = null;



        // Decode the URL parameter (handles spaces and special characters)
        const decodedId = decodeURIComponent(id);

        // Search through all collections
        for (const collectionName of collections) {
          const searchResult = await searchInCollection(collectionName, decodedId);
          if (searchResult) {
            productData = searchResult;
            foundCollection = collectionName;
            break;
          }
        }

        if (productData) {
          productData.sourceCollection = foundCollection;
          setProduct(productData);
        } else {
          setError(`Product "${decodedId}" not found in any collection`);
        }
      } catch (error) {
        setError(`Error fetching product: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    // Function to search in a specific collection
    const searchInCollection = async (collectionName, searchTerm) => {
      try {
        const collectionRef = collection(db, collectionName);
        
        // Get all documents and search through them
        const querySnapshot = await getDocs(collectionRef);
        
        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          
          // Check if any field matches the search term
          if (
            data.product_name === searchTerm ||
            data.name === searchTerm ||
            data.title === searchTerm ||
            // Check if document ID matches (for backwards compatibility)
            doc.id === searchTerm
          ) {
            return {
              id: doc.id, // This will be the actual Firestore document ID
              ...data
            };
          }
        }
        
        return null;
      } catch (error) {
        return null;
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setError('No product ID provided');
      setLoading(false);
    }
  }, [id]);

  // Helper functions
  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return '0.00';
    return numPrice.toFixed(2);
  };

  const generateOriginalPrice = (currentPrice) => {
    const num = parseFloat(currentPrice);
    return (num * 1.25).toFixed(2); // 25% markup for "original" price
  };

  const calculateSavings = (current, original) => {
    const savings = parseFloat(original) - parseFloat(current);
    const percentage = Math.round((savings / parseFloat(original)) * 100);
    return { amount: savings.toFixed(2), percentage };
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} ${product?.product_name} to cart`);
    alert(`Added ${quantity} item(s) to cart!`);
    // Add your cart logic here
  };

  const handleBuyNow = () => {
    console.log(`Buy now: ${quantity} ${product?.product_name}`);
    alert(`Proceeding to checkout with ${quantity} item(s)`);
    // Add your buy now logic here
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading"> 
          <ClipLoader size={50} color="#2637be"/>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="error-message">Error: {error}</div>
        <Footer />
      </>
    );
  }

  // Mock multiple images for demo - you can replace with actual product images
  const productImages = [
    product?.imgUrl || 'placeholder.png',
    product?.imgUrl || 'placeholder.png',
    product?.imgUrl || 'placeholder.png',
    product?.imgUrl || 'placeholder.png'
  ];

  const formattedPrice = formatPrice(product.price);
  const originalPrice = generateOriginalPrice(product.price);
  const savings = calculateSavings(formattedPrice, originalPrice);

  return (
    <>
      <Navbar />
      <div className="product-container">
        {/* Breadcrumb Navigation */}
        <div className="breadcrumb">
          <a href="/">Home</a> › <a href="/products">Products</a> › <span>{product.category || product.sourceCollection || 'Category'}</span>
        </div>

        <div id="product-details" className="product-details">
          <div className="left-column">
            {/* Image Section */}
            <div className="image-section">
              <div className="main-image-container">
                <img 
                  src={`/assets/images/${productImages[selectedImage]}`}
                  alt={product.product_name || 'Product'}
                  className="main-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/images/placeholder.png';
                  }}
                />
              </div>
              <div className="thumbnail-images">
                {productImages.map((img, index) => (
                  <div 
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={`/assets/images/${img}`}
                      alt={`Product view ${index + 1}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/placeholder.png';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div className="product-info">
              <h1 className="product-title">{product.product_name || product.name || product.title || 'Product Name'}</h1>
              
              <a href="#" className="brand-link">Visit the {product.brand || 'Store'} Store</a>

              <div className="rating-section">
                <span className="stars">★★★★☆</span>
                <a href="#" className="rating-text">4.2 out of 5 stars</a>
                <span className="rating-text">1,247 ratings</span>
              </div>

              <div className="price-section">
                <div className="price-label">Price:</div>
                <span className="current-price">
                  <span className="price-currency">$</span>{formattedPrice}
                </span>
                <span className="original-price">${originalPrice}</span>
                <span className="savings">Save ${savings.amount} ({savings.percentage}%)</span>
                
                <div className="prime-badge">
                 <img className="prime-logo" src={`/assets/images/${product.gpremium}`} alt="" />
                  <span>FREE One-Day Delivery</span>
                </div>
              </div>

              <div className="product-description">
                <h3 className="description-title">About this item</h3>
                <div className="description-text">
                  {product.description || 'Product description not available.'}
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Section */}
          <div className="purchase-section">
            <div className="buy-box-price">
              ${formattedPrice}
            </div>

            <div className="delivery-info">
              <div><span className="highlight">FREE Returns</span></div>
              <div style={{ marginTop: '8px' }}>
                <span className="highlight">FREE delivery</span> <strong>Tuesday, June 10</strong>
              </div>
              <div style={{ marginTop: '4px', fontSize: '12px', color: '#565959' }}>
                Or fastest delivery <strong>Tomorrow, June 8</strong>. Order within <span style={{ color: '#007600' }}>7 hrs 23 mins</span>
              </div>
            </div>

            <div className="stock-info">{product.stock}</div>

            <div className="quantity-selector">
              <label className="quantity-label" htmlFor="quantity">Qty:</label>
              <select 
                className="quantity-dropdown" 
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              >
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Buy Now
            </button>

            <div className="secure-transaction">
              🔒 <a href="#">Secure transaction</a>
            </div>

            <div className="sold-by">
              <div><strong>Ships from</strong> Gulime</div>
              <div><strong>Sold by</strong> <a href="#">{product.seller || 'Official Store'}</a></div>
            </div>

            <div className="additional-options">
              <a href="#" className="option-link">🛡️ Add a protection plan</a>
              <a href="#" className="option-link">📋 Add to List</a>
              <a href="#" className="option-link">💝 Add to Gift List</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}