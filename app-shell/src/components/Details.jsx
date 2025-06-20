/* eslint-disable no-unused-vars */
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { auth, db } from "../db/firebase";
import SecNav from "./SecNav";
import { Battery, Gauge, Timer } from "lucide-react";
import { getProductHighlights } from "./productHighlights";

export default function Details() {   
  const [user, setUser] = useState(null);
const [userLoading, setUserLoading] = useState(true);
 const [toast, setToast] = useState({ show: false, message: '', type: '' });
 

let { id } = useParams();


 const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };
const navigate = useNavigate();
 useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUserLoading(false);
    });
    return () => unsubscribe();
  }, []);

  

  
const {
     // State
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
          displayStorageName,
    displayName,
    isCarProduct,
    
    // Car-specific state
    selectedModel,
    selectedTrim,
    selectedWheels,
    selectedInterior,
    selectedAutopilot,
    selectedExtras,
    estimatedDelivery,
    
    // Setters
    setSelectedImage,
    setShowMore,
    setSelectedColor,
    setSelectedWheels,
    
    // Handlers
    handleStorageChange,
    handleQuantityChange,
    handleColorChange,
    
    handleModelChange,
    handleTrimChange,
    handleWheelsChange,
    handleInteriorChange,
    handleAutopilotChange,
    handleExtrasChange,
    
    // Helpers
    getProductImages,
    getCarConfigImages,
   
    getCurrentSelections,
    resetSelections
} = useProductDetails(id);

const { formatPrice, generateOriginalPrice, calculateSavings } = priceUtils;
 const handleCartButtonClick = async (product) => {
  const selections = getCurrentSelections();
  const quantity = 1;

  const result = await cartHandlers.handleAddToCart(
    product,
    quantity,
    showToast,
    selections
  );

  if (result.success && result.shouldNavigate) {
    showToast('Item added to cart!', 'success');

    setTimeout(() => {
      navigate('/cart');
    }, 1000);
  } else {
    showToast('Failed to add to cart.', 'error');
  }
};

const product12 = { category: 'electronics' };
const highlights = getProductHighlights(product12);

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
<button onClick={() => navigate(-1)} className="no-page-button">← Go Back</button>
</div>
<Footer />
</>
);
}

const productImages = getProductImages();



return (
<>
<Navbar />
<SecNav/>
<div className="product-container">
{/* Breadcrumb Navigation */}
<div className="breadcrumb">
  <Link to="/">Home</Link>
  <span className="breadcrumb-separator">›</span>
  
  {/* Main category (automotive) */}
  <Link to={`/category/${product.category}`}>
    {product.category}
  </Link>
  <span className="breadcrumb-separator">›</span>
  
  {/* Subcategory (electric) */}
  <Link to={`/category/${product.SourceCategory}`}>
    {product.SourceCategory}
  </Link>
  <span className="breadcrumb-separator">›</span>
  
  {/* Current product */}
  <span className="current-product">{product.brand}</span>
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
<h1 className="product-title">
{product.product_name}{selectedStorage ? ` - ${selectedStorage}GB` : ''}
 </h1>
              
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
                
{/* Key Features - Bullet Points */}
<ul className="feature-list">
<div className="product-configuration">


{/* Car Configuration Section - Only show for automotive products */}

{/* Car Configuration Section - FIXED VERSION */}
{product.category?.toLowerCase() === 'automotive' && product.colors && (
  <div className="config-section">
<div style={{
display: 'flex',
alignItems: 'center',
justifyContent: 'space-between',
padding: '32px 24px',
gap: '48px',
fontFamily: "'Gotham', 'Helvetica Neue', Arial, sans-serif",
maxWidth: '700px',
margin: '0 auto',
background: '#ffffff',
borderRadius: '8px',
boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
border: '1px solid #f4f4f4'}}>
{/* Range */}

<div style={{
textAlign: 'center',
flex: 1,
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
gap: '12px'}}>

<Battery 
size={32} 
color="#171a20" 
strokeWidth={1.5}
style={{
marginBottom: '4px'
}}/>

<div style={{
fontSize: '28px',
fontWeight: '300',
color: '#171a20',
lineHeight: '1',
marginBottom: '2px',
letterSpacing: '-0.5px'}}>
{product.range}
</div>

<div style={{
fontSize: '12px',
color: '#393c41',
fontWeight: '500',
textTransform: 'uppercase',
letterSpacing: '1px'}}>
Range
</div>
</div>
      
{/* Separator */}
<div style={{
width: '1px',
height: '80px',
background: 'linear-gradient(to bottom, transparent, #e8e8e8, transparent)',
opacity: 0.6
}}>
</div>
      
{/* 0-60 mph */}
<div style={{
textAlign: 'center',
flex: 1,
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
gap: '12px'}}>

<Timer 
size={32} 
color="#171a20" 
strokeWidth={1.5}
style={{
marginBottom: '4px'
}}/>

<div style={{
fontSize: '28px',
fontWeight: '300',
color: '#171a20',
lineHeight: '1',
marginBottom: '2px',
letterSpacing: '-0.5px'}}>
{product.acceleration}
</div>

<div style={{
fontSize: '12px',
color: '#393c41',
fontWeight: '500',
textTransform: 'uppercase',
letterSpacing: '1px'}}>
0-60 mph
</div>
</div>
      
{/* Separator */}
<div style={{
width: '1px',
height: '80px',
background: 'linear-gradient(to bottom, transparent, #e8e8e8, transparent)',
opacity: 0.6
}}>
</div>
      
{/* Top Speed */}
<div style={{
textAlign: 'center',
flex: 1,
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
gap: '12px'}}>

<Gauge 
size={32} 
color="#171a20" 
strokeWidth={1.5}
style={{
marginBottom: '4px'
}}
/>
<div style={{
fontSize: '28px',
fontWeight: '300',
color: '#171a20',
lineHeight: '1',
marginBottom: '2px',
letterSpacing: '-0.5px'
}}>
{product.topSpeed}
</div>

<div style={{
fontSize: '12px',
color: '#393c41',
fontWeight: '500',
textTransform: 'uppercase',
letterSpacing: '1px'
}}>
Top Speed
</div>
</div>
</div>

    {/* Color Selector */}
    <div className="section">
      <h2>Color</h2>
      <div className="color-options">
        {product.colors.map((color) => (
          <div key={color.code} className="color-option">
            <div
              className={`color-circle ${
                selectedColor === color.code ? 'selected' : ''
              }`}
              style={{ backgroundColor: color.hex }}
              onClick={() => handleColorChange(color.code)}
              title={color.name}
            />
            <span style={{display:'flex',justifyContent:'center'}} className="option-price">${color.price}</span>
          </div>
        ))}
      </div>
      <p className="selected-color-name">
        {product.colors.find(c => c.code === selectedColor)?.name || 'Select a color'}
      </p>
    </div>

    {/* Wheels Selector */}
    {product.wheels && product.wheels.length > 0 && (
      <div className="section">
        <h2>Wheels</h2>
        {product.wheels.map((wheel) => (
          <label key={wheel.code} className="option-card">
            <input 
              type="radio" 
              name="wheels" 
              checked={selectedWheels === wheel.code}
              onChange={() => handleWheelsChange(wheel.code)}
            />
            <span className="option-name">{wheel.name}</span>
            <span className="option-price">${wheel.price.toLocaleString()}</span>
          </label>
        ))}
      </div>
    )}

    {/* Interior Selector */}
    {product.interiors && product.interiors.length > 0 && (
      <div className="section">
        <h2>Interior</h2>
        {product.interiors.map((interior) => (
          <label key={interior.code} className="option-card">
            <input 
              type="radio" 
              name="interior" 
              checked={selectedInterior === interior.code}
              onChange={() => handleInteriorChange(interior.code)}
            />
            <span className="option-name">{interior.name}</span>
            <span className="option-price">${interior.price.toLocaleString()}</span>
          </label>
        ))}
      </div>
    )}

    {/* Autopilot */}
    {product.autopilot && product.autopilot.length > 0 && (
      <div className="section">
        <h2>Autopilot</h2>
        {product.autopilot.map((pkg) => (
          <label key={pkg.code} className="option-card autopilot-card">
            <input 
              type="radio" 
              name="autopilot" 
              checked={selectedAutopilot === pkg.code}
              onChange={() => handleAutopilotChange(pkg.code)}
            />
            <div className="autopilot-info">
              <div className="autopilot-name">{pkg.name}</div>
              <ul className="autopilot-features">
                {pkg.features && pkg.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
            <span className="option-price">${pkg.price.toLocaleString()}</span>
          </label>
        ))}
      </div>
    )}

    {/* Extras */}
{product.extras && product.extras.length > 0 && (
  <div className="section">
    <h2>Extras</h2>
    {product.extras.map((extra, i) => (
      <label key={i} className="option-card extra-card">
        <input 
          type="radio" 
          name="extras"
          checked={selectedExtras.some(e => e.name === extra.name)}
          onChange={() => handleExtrasChange(extra)}
        />
        <div className="extra-info">
          <div className="extra-name">{extra.name}</div>
          <div className="extra-desc">{extra.description}</div>
        </div>
        <span className="option-price">${extra.price.toLocaleString()}</span>
      </label>
    ))}
  </div>
)}


    {/* Configuration Summary and Total */}
    <div className="section config-summary-section">
      <div className="configuration-summary">
        <h3>Your Configuration</h3>
        <div className="config-details">
          <div className="config-item">
            <span>Color:</span>
            <span>{product.colors?.find(c => c.code === selectedColor)?.name || 'Not selected'}</span>
          </div>
          {product.wheels && (
            <div className="config-item">
              <span>Wheels:</span>
              <span>{product.wheels?.find(w => w.code === selectedWheels)?.name || 'Not selected'}</span>
            </div>
          )}
          {product.interiors && (
            <div className="config-item">
              <span>Interior:</span>
              <span>{product.interiors?.find(i => i.code === selectedInterior)?.name || 'Not selected'}</span>
            </div>
          )}
          {product.autopilot && (
            <div className="config-item">
              <span>Autopilot:</span>
              <span>{product.autopilot?.find(a => a.code === selectedAutopilot)?.name || 'Not selected'}</span>
            </div>
          )}
          {selectedExtras.length > 0 && (
            <div className="config-item">
              <span>Extras:</span>
              <span>{selectedExtras.map(e => e.name).join(', ')}</span>
            </div>
          )}
        </div>
      </div>


    </div>
  </div>
)}


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

<h3 className="description-title">About Product</h3>

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

{product.range && (
<li>
<strong>Battery Range:</strong> {product.range} (EPA estimated)
</li>  
)}

{product.acceleration && (
<li>
<strong>0–60 MPH:</strong> {product.acceleration} (Performance model)
</li>
 )}

{product.screen_size && (
<li>
<strong>Screen Size:</strong> {product.screen_size}
</li>
)}

{product.display_resolution && (
<li>
<strong>Display Resolution:</strong> {product.display_resolution}
</li>
)}

{product.warranty && (
<li>
<strong>Warranty:</strong> {product.warranty} manufacturer warranty included
</li>
)}
                  
{/* Default features if specific data isn't available */}

                  
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
<h5>What&apos;s in the Box</h5>
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
    {getProductHighlights(product).map((highlight, index) => (
      <div key={index} className="highlight-item">
        <span className="highlight-icon">{highlight.icon}</span>
        <div>
          <strong>{highlight.title}</strong>
          <p>{highlight.desc}</p>
        </div>
      </div>
    ))}
  </div>
</div>

</div>

{/* Technical Specifications Table - Enhanced Version */}
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
      
      {/* Display Specifications */}
      {product.screen_size && (
        <tr>
          <td className="spec-label">Screen Size</td>
          <td className="spec-value">{product.screen_size}</td>
        </tr>
      )}
      {product.specifications?.display?.type && (
        <tr>
          <td className="spec-label">Display Type</td>
          <td className="spec-value">{product.specifications.display.type}</td>
        </tr>
      )}
      {product.specifications?.display?.resolution && (
        <tr>
          <td className="spec-label">Display Resolution</td>
          <td className="spec-value">{product.specifications.display.resolution}</td>
        </tr>
      )}
      {product.specifications?.display?.technology && (
        <tr>
          <td className="spec-label">Display Technology</td>
          <td className="spec-value">{product.specifications.display.technology}</td>
        </tr>
      )}
      {product.specifications?.display?.features && (
        <tr>
          <td className="spec-label">Display Features</td>
          <td className="spec-value">{product.specifications.display.features.join(', ')}</td>
        </tr>
      )}
      
      {/* Chip/Processor Specifications */}
      {product.specifications?.chip?.model && (
        <tr>
          <td className="spec-label">Processor</td>
          <td className="spec-value">{product.specifications.chip.model}</td>
        </tr>
      )}
      {product.specifications?.chip?.cpu && (
        <tr>
          <td className="spec-label">CPU</td>
          <td className="spec-value">{product.specifications.chip.cpu}</td>
        </tr>
      )}
      {product.specifications?.chip?.gpu && (
        <tr>
          <td className="spec-label">GPU</td>
          <td className="spec-value">{product.specifications.chip.gpu}</td>
        </tr>
      )}
      {product.specifications?.chip?.neuralEngine && (
        <tr>
          <td className="spec-label">Neural Engine</td>
          <td className="spec-value">{product.specifications.chip.neuralEngine}</td>
        </tr>
      )}
      
      {/* Camera Specifications */}
      {product.specifications?.camera?.main?.megapixels && (
        <tr>
          <td className="spec-label">Main Camera</td>
          <td className="spec-value">{product.specifications.camera.main.megapixels}</td>
        </tr>
      )}
      {product.specifications?.camera?.front?.type && (
        <tr>
          <td className="spec-label">Front Camera</td>
          <td className="spec-value">{product.specifications.camera.front.type}</td>
        </tr>
      )}
      {product.specifications?.camera?.main?.aperture && (
        <tr>
          <td className="spec-label">Main Camera Aperture</td>
          <td className="spec-value">{product.specifications.camera.main.aperture}</td>
        </tr>
      )}
      
      {/* Connectivity Specifications */}
      {product.specifications?.connectivity?.allModels && (
        <tr>
          <td className="spec-label">Wi-Fi</td>
          <td className="spec-value">{product.specifications.connectivity.allModels.find(item => item.includes('Wi-Fi'))}</td>
        </tr>
      )}
      {product.specifications?.connectivity?.allModels && (
        <tr>
          <td className="spec-label">Bluetooth</td>
          <td className="spec-value">{product.specifications.connectivity.allModels.find(item => item.includes('Bluetooth'))}</td>
        </tr>
      )}
      
      {/* Charging and Ports */}
      {product.specifications?.charging?.port && (
        <tr>
          <td className="spec-label">Charging Port</td>
          <td className="spec-value">{product.specifications.charging.port}</td>
        </tr>
      )}
      {product.specifications?.charging?.supports && (
        <tr>
          <td className="spec-label">Port Capabilities</td>
          <td className="spec-value">{product.specifications.charging.supports.join(', ')}</td>
        </tr>
      )}
      
      {/* Display Support */}
      {product.specifications?.displaySupport?.external && (
        <tr>
          <td className="spec-label">External Display Support</td>
          <td className="spec-value">{product.specifications.displaySupport.external}</td>
        </tr>
      )}
      {product.specifications?.displaySupport?.outputs && (
        <tr>
          <td className="spec-label">Video Outputs</td>
          <td className="spec-value">{product.specifications.displaySupport.outputs.join(', ')}</td>
        </tr>
      )}
      
      {/* Audio Specifications */}
      {product.specifications?.audio?.speakers && (
        <tr>
          <td className="spec-label">Speakers</td>
          <td className="spec-value">{product.specifications.audio.speakers}</td>
        </tr>
      )}
      {product.specifications?.audio?.microphones && (
        <tr>
          <td className="spec-label">Microphones</td>
          <td className="spec-value">{product.specifications.audio.microphones}</td>
        </tr>
      )}
      
      {/* Sensors */}
      {product.specifications?.sensors && (
        <tr>
          <td className="spec-label">Sensors</td>
          <td className="spec-value">{product.specifications.sensors.join(', ')}</td>
        </tr>
      )}
      
      {/* Apple Pencil Support */}
      {product.specifications?.display?.pencilSupport && (
        <tr>
          <td className="spec-label">Apple Pencil Support</td>
          <td className="spec-value">{product.specifications.display.pencilSupport.join(', ')}</td>
        </tr>
      )}
      
      {/* Video Recording Capabilities */}
      {product.specifications?.videoRecording?.main?.formats && (
        <tr>
          <td className="spec-label">Video Recording Formats</td>
          <td className="spec-value">{product.specifications.videoRecording.main.formats}</td>
        </tr>
      )}
      
      {/* Physical Specifications */}
      <tr>
        <td className="spec-label">Item Weight</td>
        <td className="spec-value">{product.weight || "1.2 lbs"}</td>
      </tr>
      <tr>
        <td className="spec-label">Product Dimensions</td>
        <td className="spec-value">{product.dimensions || "10 x 7 x 0.3 inches"}</td>
      </tr>
      <tr>
        <td className="spec-label">Manufacturer</td>
        <td className="spec-value">{product.brand}</td>
      </tr>
      <tr>
        <td className="spec-label">Country of Origin</td>
        <td className="spec-value">{product.origin || "USA"}</td>
      </tr>
      
      {/* Storage Options */}
      {product.storageDetails && (
        <tr>
          <td className="spec-label">Storage Options</td>
          <td className="spec-value">{product.storageDetails}</td>
        </tr>
      )}
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

<button className="add-to-cart-btn"   onClick={() => handleCartButtonClick(product)}
>
Add to Cart - ${formatPrice(totalPrice || (configPrice || product?.price || 0) * quantity)}
</button>

<button style={{ width: '100%' }}
onClick={() => navigate('/')} 
className="continue-shopping-btn"
>
Continue Shopping
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