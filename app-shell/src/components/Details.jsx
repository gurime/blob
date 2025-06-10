import { Link, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ClipLoader from "react-spinners/ClipLoader";
import DeliveryInfo from "./DeliveryInfo";
import ProductRating from "./ProductRating";
import { useProductDetails } from "../hooks/useProductDetails";
import { cartHandlers } from "../utils/cartHandlers";
import { priceUtils } from "../utils/priceUtils";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../db/firebase";

export default function Details() {   
let { id } = useParams();
const [user, setUser] = useState(null);
const [userLoading, setUserLoading] = useState(true);

 useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUserLoading(false);
    });
    return () => unsubscribe();
  }, []);

  
const {
product,
loading,
error,
selectedImage,
basePrice,
configPrice,
totalPrice,
quantity,
showMore,
selectedColor,
selectedStorage,
setSelectedImage,
setShowMore,
setSelectedColor,
handleStorageChange,
handleQuantityChange,
getProductImages
} = useProductDetails(id);

const { formatPrice, generateOriginalPrice, calculateSavings } = priceUtils;
const { handleAddToCart, handleBuyNow } = cartHandlers;

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

if (error || !product) {
return (
<>
<Navbar />
<div className="error-message">
<h2>Product Not Found</h2>
<p>{error || "The requested product could not be found."}</p>
<Link to="/products">← Back to Products</Link>
</div>
<Footer />
</>
);
}

const productImages = getProductImages();

return (
<>
<Navbar />
<div className="product-container">
{/* Breadcrumb Navigation */}
<div className="breadcrumb">
<Link to="/">Home</Link>
<Link to="/products">All Products</Link>
<Link to={`/category/${encodeURIComponent(product.SourceCategory)}`}>
{product.SourceCategory}
</Link>

<Link to={`/category/${encodeURIComponent(product.category)}`}>
{product.category}
</Link>

<Link to={`/category/${encodeURIComponent(product.category)}/${encodeURIComponent(product.brand)}`}>{product.brand}</Link>
</div>

<div id="product-details" className="product-details">
<div className="left-column">

{/* Image Section */}
<div className="image-section">
<div className="main-image-container">
<img 
src={`/assets/images/${productImages[selectedImage]}`}
alt={product.product_name}
className="main-image"/>
</div>

{/* thumbnail images */}
<div className="thumbnail-images">

{productImages.map((img, index) => (
<div 
key={index}
className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
onClick={() => setSelectedImage(index)}>
<img 
src={`/assets/images/${img}`}
alt={`Product view ${index + 1}`}/>
</div>
))}
</div>
</div>

{/* Product Information */}
<div className="product-info">
<h1 className="product-title">{product.product_name}</h1>
              
<Link href="#" className="brand-link">Visit the {product.brand} Store</Link>

{/* Rating Section - Now using the ProductRating component */}
  <ProductRating
rating={product.rating || 0}
totalReviews={product.totalReviews || 0}
isInteractive={true}  // Enable clicking
productId={product.id} // Use _id for featured products
userId={user?.uid || null} // Pass current user ID safely
showLink={true} // Show link to reviews
/>

<div className="price-section">
<div className="price-row">
<span className="price-label">Price:</span>
<span className="current-price">
<span className="price-currency">$</span>
{formatPrice(configPrice || product?.price || 0)}
</span>
</div>

{/* Delivery Info Section */}
<DeliveryInfo hasPremium={!!product?.gpremium} />

{/* Show base price if upgraded config is selected */}
{configPrice > basePrice && (
<div className="base-price">
Base price: ${formatPrice(basePrice)}
</div>
)}

{/* Show quantity pricing */}
{quantity > 1 && (
<div className="quantity-pricing">
<div className="unit-price">
Unit price: ${formatPrice(configPrice || product?.price || 0)}
</div>

<div className="quantity-count">
Quantity: {quantity}
</div>

<div className="total-price">
Total: ${formatPrice(totalPrice || (configPrice || product?.price || 0) * quantity)}
</div>
</div>
)}

{/* Price Comparison */}
<div className="price-comparison">
<span className="original-price">
${generateOriginalPrice(configPrice || product?.price || 0)}
</span>

<span className="savings">
Save ${calculateSavings(
formatPrice(configPrice || product?.price || 0),
generateOriginalPrice(configPrice || product?.price || 0)).amount}{' '}
({calculateSavings(
formatPrice(configPrice || product?.price || 0),
generateOriginalPrice(configPrice || product?.price || 0)
).percentage}%)
</span>
</div>

{/* Prime Badge, only if gpremium image exists */}
{product?.gpremium && (
<div className="prime-badge">
<img className="prime-logo" src={`/assets/images/${product.gpremium}`} alt="Prime" />
<span>FREE One-Day Delivery</span>
</div>
)}
</div>

{/* Main Description */}
<div className="product-description">
<h3 className="description-title">About Product</h3>
                
{/* Key Features - Bullet Points */}
<ul className="feature-list">
{/* Dynamic features based on product data */}
{product.model && (
<li>
<strong>Model:</strong> {product.model}
</li>
)}
                  
{product.brand && (
<li>
<strong>Brand:</strong> {product.brand} 
</li>
)}
                  
{product.category && (
<li>
<strong>Category:</strong> {product.category}
</li>
)}

<div className="product-configuration">
{/* Color Selection */}
{product.avaibleColors?.colors && product.avaibleColors.colors.length > 0 && (
<div className="config-section">
<div className="config-label">
<span className="config-title">Color: </span>
<span className="selected-option">
{product.avaibleColors.colors.find(c => c.code === selectedColor)?.name || 'Select Color'}
</span>
</div>
                        
<div className="color-options">
{product.avaibleColors.colors.map((color) => (
<div
key={color.code}
className={`color-swatch ${selectedColor === color.code ? 'selected' : ''} ${!color.available ? 'unavailable' : ''}`}
onClick={() => color.available && setSelectedColor(color.code)}
title={color.product_name}>

<div className="color-circle" style={{ backgroundColor: color.hex }}/>
{!color.available && <div className="unavailable-overlay">✕</div>}
</div>
))}
</div>
</div>
)}

{/* Storage Selection */}
{product.storageOptions?.storage && product.storageOptions.storage.length > 0 && (
<div className="config-section">
<div className="config-label">
<span className="config-title">Storage: </span>
<span className="selected-option">{selectedStorage}</span>
</div>
                        
<div className="storage-options">
{product.storageOptions.storage.map((storage) => (
<div
key={storage.size}
className={`storage-option ${selectedStorage === storage.size ? 'selected' : ''} ${!storage.available ? 'unavailable' : ''}`}
onClick={() => storage.available && handleStorageChange(storage)}>

<div className="storage-info">
<span className="storage-size">{storage.size}</span>
{storage.price > 0 && (
<span className="storage-price">+${storage.price}</span>
)}
</div>
{!storage.available && <div className="unavailable-text">Currently Unavailable</div>}
</div>
))}
</div>
</div>
)}

{/* Configuration Summary */}
<div className="config-summary">
<div className="selected-config">
{selectedColor && product.avaibleColors?.colors && (
<span className="config-detail">
{product.avaibleColors.colors.find(c => c.code === selectedColor)?.name}
</span>
)}

{selectedColor && selectedStorage && <span className="separator"> • </span>}
{selectedStorage && (
<span className="config-detail">{selectedStorage}</span>
)}
</div>
</div>
</div>

{product.warranty && (
<li>
<strong>Warranty:</strong> {product.warranty} manufacturer warranty included
</li>
)}
                  
{/* Default features if specific data isn't available */}
<li>
<strong>Premium Quality:</strong> Built with high-grade materials for durability and performance
</li>
                  
<li>
<strong>Fast Shipping:</strong> Ships quickly with secure packaging and tracking
</li>
                  
<li>
<strong>Customer Support:</strong> Backed by excellent customer service and technical support
</li>
</ul>

{/* Main Description */}
<div className="detailed-description">
{/* Primary Description */}
<div className="description-text">
<p>{product.description}</p>
                    
{/* Additional Description Fields */}
{product.description1 && (
<p>{product.description1}</p>
)}
                    
{product.description2 && (
<p>{product.description2}</p>
)}
</div>

{/* Expandable "Show More" Section */}
<div className="expandable-description">
<div className={`additional-content ${showMore ? 'expanded' : 'collapsed'}`}>
{/* Extended Product Information */}
<div className="extended-info">
{/* Product Features & Benefits */}
{(product.description3 || product.description4) && (
<>
<h5>Product Features & Benefits</h5>
{product.description3 && <p>{product.description3}</p>}
{product.description4 && <p>{product.description4}</p>}
</>
)}

{/* Advanced Technology */}
{(product.description5 || product.description6) && (
<>
<h5>Advanced Technology</h5>
{product.description5 && <p>{product.description5}</p>}
{product.description6 && <p>{product.description6}</p>}
</>
)}

{/* Perfect For */}
{[product.useCase1, product.useCase2, product.useCase3, product.useCase4, product.useCase5].some(Boolean) && (
<>
<h5>Perfect For</h5>
<ul className="use-cases">
{product.useCase1 && <li>{product.useCase1}</li>}
{product.useCase2 && <li>{product.useCase2}</li>}
{product.useCase3 && <li>{product.useCase3}</li>}
{product.useCase4 && <li>{product.useCase4}</li>}
{product.useCase5 && <li>{product.useCase5}</li>}
</ul>
</>
)}

{/* What's in the Box */}
{[product.boxItem1, product.boxItem2, product.boxItem3, product.boxItem4].some(Boolean) && (
<>
<h5>What's in the Box</h5>
<ul className="box-contents">
{product.boxItem1 && <li>{product.boxItem1}</li>}
{product.boxItem2 && <li>{product.boxItem2}</li>}
{product.boxItem3 && <li>{product.boxItem3}</li>}
{product.boxItem4 && <li>{product.boxItem4}</li>}
</ul>
</>
)}

{/* Additional detailed specs */}
<h5>Detailed Specifications</h5>
<div className="detailed-specs">

{product.chipDetails && (
<p><strong>Chip:</strong> {product.chipDetails}</p>
)}

{product.displayDetails && (
<p><strong>Display:</strong> {product.displayDetails}</p>
)}

{product.storageDetails && (
<p><strong>Storage:</strong> {product.storageDetails}</p>
)}

{product.connectivityDetails && (
<p><strong>Connectivity:</strong> {product.connectivityDetails}</p>
)}

{product.cameraDetails && (
<p><strong>Camera:</strong> {product.cameraDetails}</p>
)}
</div>
</div>
</div>
                    
<button className="show-more-btn" onClick={() => setShowMore(!showMore)}>
{showMore ? 'Show less' : 'Show more'}
<span className={`arrow ${showMore ? 'up' : 'down'}`}>▼</span>
</button>
</div>
                  
{/* Additional product details section */}
<div className="product-highlights">
<h4>Product Highlights</h4>
<div className="highlights-grid">
<div className="highlight-item">
<span className="highlight-icon">⚡</span>
<div>
<strong>High Performance</strong>
<p>Optimized for speed and efficiency in demanding tasks</p>
</div>
</div>
                      
<div className="highlight-item">
<span className="highlight-icon">🛡️</span>
<div>
<strong>Reliable & Secure</strong>
<p>Built-in security features and robust construction</p>
</div>
</div>
                      
<div className="highlight-item">
<span className="highlight-icon">🎯</span>
<div>
<strong>User-Friendly</strong>
<p>Intuitive design that's easy to set up and use</p>
</div>
</div>
                      
<div className="highlight-item">
<span className="highlight-icon">📞</span>
<div>
<strong>Support Included</strong>
<p>Comprehensive customer support and documentation</p>
</div>
</div>
</div>
</div>
</div>

{/* Technical Specifications Table */}
<div className="tech-specs">
<h4>Technical Details</h4>
<table className="specs-table">
<tbody>

{product.brand && (
<tr>
<td className="spec-label">Brand</td>
<td className="spec-value">{product.brand}</td>
</tr>
)}

{product.model && (
<tr>
<td className="spec-label">Model</td>
<td className="spec-value">{product.model}</td>
</tr>
)}

{product.category && (
<tr>
<td className="spec-label">Product Category</td>
<td className="spec-value">{product.category}</td>
</tr>
)}

<tr>
<td className="spec-label">Item Weight</td>
<td className="spec-value">{product.weight || '1.2 lbs'}</td>
</tr>
<tr>
<td className="spec-label">Product Dimensions</td>
<td className="spec-value">{product.dimensions || '10 x 7 x 0.3 inches'}</td>
</tr>

<tr>
<td className="spec-label">Manufacturer</td>
<td className="spec-value">{product.brand}</td>
</tr>

<tr>
<td className="spec-label">Country of Origin</td>
<td className="spec-value">{product.origin || 'USA'}</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</div>
{/* Purchase Section */}
<div className="purchase-section">
<div className="buy-box-price">
{quantity > 1 ? (
<div>
<div className="total-price-large">${formatPrice(totalPrice || (configPrice || product?.price || 0) * quantity)}</div>
<div className="unit-price-small">${formatPrice(configPrice || product?.price || 0)} each</div>
</div>
) : (
<div>${formatPrice(configPrice || product?.price || 0)}</div>
)}
</div>

<DeliveryInfo hasPremium={!!product?.gpremium} />

<div className="stock-info">{product?.stock || 'In Stock'}</div>

<div className="quantity-selector">
<label className="quantity-label" htmlFor="quantity">Qty:</label>
<select 
className="quantity-dropdown" 
id="quantity"
value={quantity}
onChange={(e) => handleQuantityChange(parseInt(e.target.value))}>
{[1,2,3,4,5,6,7,8,9,10].map(num => (
<option key={num} value={num}>{num}</option>
))}
</select>
</div>

<button className="add-to-cart-btn" onClick={handleAddToCart}>
Add to Cart - ${formatPrice(totalPrice || (configPrice || product?.price || 0) * quantity)}
</button>

<button className="buy-now-btn" onClick={handleBuyNow}>
Buy Now - ${formatPrice(totalPrice || (configPrice || product?.price || 0) * quantity)}
</button>

<div className="secure-transaction">🔒
<Link to="#">Secure transaction</Link>
</div>

<div className="sold-by">
<div><strong>Ships from</strong> {product?.seller || 'Amazon'}</div>
<div><strong>Sold by</strong> <Link to="#">{product?.seller || 'Amazon'}</Link></div>
</div>

<div className="additional-options">
<Link to="#" className="option-link">🛡️ Add a protection plan</Link>
<Link to="#" className="option-link">📋 Add to List</Link>
<Link to="#" className="option-link">💝 Add to Gift List</Link>
</div>
</div>
</div>
</div>
<Footer />
</>
  );
}