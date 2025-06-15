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
import { collection, getDocs } from "firebase/firestore";

export default function Details() {   
  const [user, setUser] = useState(null);
const [userLoading, setUserLoading] = useState(true);
 const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [Product, setProduct] = useState(null);
const [selectedCarColor, setSelectedCarColor] = useState('');
const [selectedWheels, setSelectedWheels] = useState('');
const [selectedInterior, setSelectedInterior] = useState('');
const [selectedAutopilot, setSelectedAutopilot] = useState('');
const [selectedExtras, setSelectedExtras] = useState([]);
let { id } = useParams();

const fetchAllProducts = async () => {
  try {
    const allProducts = [];

    const productCollections = [
      "products",
      "featuredProducts",
      "automotive",
    ];

    for (const path of productCollections) {
      try {
        const colRef = collection(db, ...path.split("/"));
        const snapshot = await getDocs(colRef);

        snapshot.forEach((doc) => {
          allProducts.push({
            id: doc.id,
            ...doc.data(),
            sourceCollection: path,
          });
        });
      } catch (err) {
        console.warn(`Failed to fetch from ${path}:`, err.message);
        // Continue to next collection
      }
    }

    return allProducts;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
};

useEffect(() => {
  const loadProduct = async () => {
    const allProducts = await fetchAllProducts();
    const matched = allProducts.find((prod) => prod.id === id);
    if (matched) {
      setProduct(matched);
    } else {
      console.error("Product not found");
    }
  };

  loadProduct();
}, [id]);


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
    setSelectedImage,
    setShowMore,
    setSelectedColor,
    handleStorageChange,
    handleQuantityChange,
    getProductImages,
    getCurrentSelections,
    handleExtrasChange,
    handleAutopilotChange,
    handleInteriorChange,
    handleModelChange,
    handleTrimChange,
    handleWheelsChange,
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

  // Helper function to get features by category name
function getFeatures(categoryName, highlightsObj, defaultHighlights) {
  // Normalize the category name by removing spaces and converting to lowercase
  const normalized = categoryName.toLowerCase().replace(/\s+/g, '').replace(/&/g, '');
  // Direct match first
  if (highlightsObj[categoryName]) return highlightsObj[categoryName];
  // Try normalized version
  const normalizedKey = Object.keys(highlightsObj).find(key =>
    key.toLowerCase().replace(/\s+/g, '').replace(/&/g, '') === normalized
  );
  return normalizedKey ? highlightsObj[normalizedKey] : defaultHighlights;
}

const getProductHighlights = (product) => {
  const category = product.category?.toLowerCase() || '';
  
  // Category-specific highlights
  const categoryHighlights = {
    // Electronics & Tech
    electronics: [
      { icon: '⚡', title: 'High Performance', desc: 'Optimized for speed and efficiency in demanding tasks' },
      { icon: '🔋', title: 'Long Battery Life', desc: 'Extended usage time with efficient power management' },
      { icon: '📱', title: 'Smart Features', desc: 'Advanced technology with intuitive controls' },
      { icon: '🛡️', title: 'Reliable & Secure', desc: 'Built-in security features and robust construction' }
    ],

    'headphones & earbuds': [
      { icon: '🎵', title: 'Premium Sound', desc: 'Crystal-clear audio with rich bass and crisp highs' },
      { icon: '🔇', title: 'Noise Cancellation', desc: 'Advanced noise-canceling technology for immersive listening' },
      { icon: '🔋', title: 'Long Battery Life', desc: 'Extended playtime with quick charging capabilities' },
      { icon: '💧', title: 'Sweat Resistant', desc: 'Durable design perfect for workouts and daily use' }
    ],

    tablets: [
      { icon: '📱', title: 'Portable Design', desc: 'Lightweight and easy to carry anywhere' },
      { icon: '🎨', title: 'Creative Tools', desc: 'Perfect for drawing, note-taking, and creative work' },
      { icon: '⚡', title: 'Fast Performance', desc: 'Smooth multitasking and responsive touch experience' },
      { icon: '📺', title: 'Entertainment Ready', desc: 'Stunning display for movies, games, and reading' }
    ],

    // Books
    books: [
      { icon: '📚', title: 'Engaging Content', desc: 'Captivating stories and valuable knowledge' },
      { icon: '🧠', title: 'Mind Expanding', desc: 'Broaden perspectives and gain new insights' },
      { icon: '✨', title: 'Quality Writing', desc: 'Expert authors and professional editing' },
      { icon: '🎯', title: 'Perfect Selection', desc: 'Curated collection for every interest and reading level' }
    ],

    // Fashion
    fashion: [
      { icon: '👕', title: 'Premium Materials', desc: 'High-quality fabrics for comfort and durability' },
      { icon: '✨', title: 'Stylish Design', desc: 'Modern styling that fits any occasion' },
      { icon: '🧵', title: 'Quality Construction', desc: 'Expert craftsmanship in every detail' },
      { icon: '💫', title: 'Versatile Style', desc: 'Easy to mix and match with your wardrobe' }
    ],

    clothing: [
      { icon: '👕', title: 'Premium Materials', desc: 'High-quality fabrics for comfort and durability' },
      { icon: '✨', title: 'Stylish Design', desc: 'Modern styling that fits any occasion' },
      { icon: '🧵', title: 'Quality Construction', desc: 'Expert craftsmanship in every detail' },
      { icon: '💫', title: 'Versatile Style', desc: 'Easy to mix and match with your wardrobe' }
    ],

    shoes: [
      { icon: '👟', title: 'All-Day Comfort', desc: 'Cushioned support for extended wear' },
      { icon: '🏃', title: 'Superior Grip', desc: 'Advanced sole design for any surface' },
      { icon: '💨', title: 'Breathable Design', desc: 'Moisture-wicking materials keep feet dry' },
      { icon: '💎', title: 'Durable Build', desc: 'Long-lasting construction for daily use' }
    ],

    // Health & Beauty
    health: [
      { icon: '💊', title: 'Proven Effective', desc: 'Clinically tested formulas for reliable results' },
      { icon: '🌿', title: 'Natural Ingredients', desc: 'Safe, gentle formulations with natural components' },
      { icon: '🔬', title: 'Science-Backed', desc: 'Research-driven solutions for optimal health' },
      { icon: '✅', title: 'Quality Assured', desc: 'Rigorous testing and quality control standards' }
    ],

    beauty: [
      { icon: '✨', title: 'Professional Results', desc: 'Salon-quality results at home' },
      { icon: '🌿', title: 'Gentle Formula', desc: 'Safe for sensitive skin with natural ingredients' },
      { icon: '⏰', title: 'Quick & Easy', desc: 'Fast application with lasting results' },
      { icon: '💎', title: 'Premium Quality', desc: 'Luxurious experience with high-end ingredients' }
    ],

    // Toys
    toys: [
      { icon: '🎮', title: 'Educational Fun', desc: 'Learning through play with engaging activities' },
      { icon: '🛡️', title: 'Safe Materials', desc: 'Non-toxic, child-safe construction and materials' },
      { icon: '🧠', title: 'Skill Development', desc: 'Promotes creativity, problem-solving, and motor skills' },
      { icon: '👨‍👩‍👧‍👦', title: 'Family Bonding', desc: 'Perfect for shared playtime and creating memories' }
    ],

    // Automotive
    automotive: [
      { icon: '🚗', title: 'Reliable Performance', desc: 'Dependable transportation for daily needs' },
      { icon: '🛡️', title: 'Safety First', desc: 'Advanced safety features and crash protection' },
      { icon: '⚡', title: 'Fuel Efficient', desc: 'Excellent fuel economy and eco-friendly options' },
      { icon: '🔧', title: 'Low Maintenance', desc: 'Designed for minimal upkeep and long-term reliability' }
    ],

    // Grocery
    grocery: [
      { icon: '🥬', title: 'Fresh Quality', desc: 'Premium freshness and quality ingredients' },
      { icon: '🌱', title: 'Nutritious Choice', desc: 'Healthy options for balanced nutrition' },
      { icon: '📦', title: 'Convenient Shopping', desc: 'Easy ordering with fast, reliable delivery' },
      { icon: '💰', title: 'Great Value', desc: 'Competitive prices on everyday essentials' }
    ],

    // Appliances
    appliances: [
      { icon: '⚡', title: 'Energy Efficient', desc: 'Reduces utility costs with smart energy usage' },
      { icon: '🏠', title: 'Space Saving', desc: 'Compact design maximizes kitchen and home space' },
      { icon: '🔧', title: 'Easy Operation', desc: 'Intuitive controls and user-friendly features' },
      { icon: '💪', title: 'Durable Build', desc: 'Long-lasting construction for years of reliable use' }
    ],

    // Pet Supplies
    'pet-supplies': [
      { icon: '🐕', title: 'Pet-Safe Materials', desc: 'Non-toxic, pet-friendly construction and ingredients' },
      { icon: '❤️', title: 'Health Focused', desc: 'Promotes pet health and wellbeing' },
      { icon: '🎾', title: 'Engaging Design', desc: 'Keeps pets active, entertained, and mentally stimulated' },
      { icon: '🏠', title: 'Home Friendly', desc: 'Easy to clean and maintain in your living space' }
    ],

    pets: [
      { icon: '🐕', title: 'Pet-Safe Materials', desc: 'Non-toxic, pet-friendly construction and ingredients' },
      { icon: '❤️', title: 'Health Focused', desc: 'Promotes pet health and wellbeing' },
      { icon: '🎾', title: 'Engaging Design', desc: 'Keeps pets active, entertained, and mentally stimulated' },
      { icon: '🏠', title: 'Home Friendly', desc: 'Easy to clean and maintain in your living space' }
    ],

    // Baby Products
    'baby-products': [
      { icon: '👶', title: 'Baby Safe', desc: 'Gentle, non-toxic materials safe for infants' },
      { icon: '🛡️', title: 'Tested Quality', desc: 'Rigorous safety testing and quality standards' },
      { icon: '💤', title: 'Comfort First', desc: 'Designed for baby comfort and peaceful sleep' },
      { icon: '👨‍👩‍👧', title: 'Parent Approved', desc: 'Trusted by parents and recommended by experts' }
    ],

    baby: [
      { icon: '👶', title: 'Baby Safe', desc: 'Gentle, non-toxic materials safe for infants' },
      { icon: '🛡️', title: 'Tested Quality', desc: 'Rigorous safety testing and quality standards' },
      { icon: '💤', title: 'Comfort First', desc: 'Designed for baby comfort and peaceful sleep' },
      { icon: '👨‍👩‍👧', title: 'Parent Approved', desc: 'Trusted by parents and recommended by experts' }
    ],

    // Garden & Outdoor
    garden: [
      { icon: '🌱', title: 'Garden Ready', desc: 'Professional-grade tools for beautiful gardens' },
      { icon: '☀️', title: 'Weather Resistant', desc: 'Durable construction for all weather conditions' },
      { icon: '🌿', title: 'Eco-Friendly', desc: 'Sustainable materials and environmentally conscious design' },
      { icon: '⏰', title: 'Time Saving', desc: 'Efficient tools that make gardening easier and faster' }
    ],

    'garden-outdoor': [
      { icon: '🌱', title: 'Garden Ready', desc: 'Professional-grade tools for beautiful gardens' },
      { icon: '☀️', title: 'Weather Resistant', desc: 'Durable construction for all weather conditions' },
      { icon: '🌿', title: 'Eco-Friendly', desc: 'Sustainable materials and environmentally conscious design' },
      { icon: '⏰', title: 'Time Saving', desc: 'Efficient tools that make gardening easier and faster' }
    ],

    // Home
    home: [
      { icon: '🏠', title: 'Home Enhancement', desc: 'Beautiful additions that improve your living space' },
      { icon: '✨', title: 'Style & Function', desc: 'Perfect blend of aesthetic appeal and practical use' },
      { icon: '🔧', title: 'Easy Setup', desc: 'Simple installation and user-friendly design' },
      { icon: '💰', title: 'Value Addition', desc: 'Increases home comfort and property value' }
    ],

    furniture: [
      { icon: '🪑', title: 'Ergonomic Design', desc: 'Comfortable support for daily use' },
      { icon: '🏠', title: 'Space Efficient', desc: 'Smart design maximizes your living space' },
      { icon: '🌳', title: 'Quality Materials', desc: 'Durable construction from premium materials' },
      { icon: '🎨', title: 'Stylish Appeal', desc: 'Beautiful design complements any decor' }
    ],

    // Kitchen
    kitchen: [
      { icon: '🍳', title: 'Even Cooking', desc: 'Consistent heat distribution for perfect results' },
      { icon: '🧽', title: 'Easy Cleanup', desc: 'Non-stick surfaces and dishwasher-safe parts' },
      { icon: '⏱️', title: 'Time Efficient', desc: 'Faster cooking with professional-grade performance' },
      { icon: '🔥', title: 'Versatile Cooking', desc: 'Multiple functions in one convenient appliance' }
    ],

    // Music
    music: [
      { icon: '🎵', title: 'Superior Sound', desc: 'High-quality audio for the ultimate listening experience' },
      { icon: '🎤', title: 'Professional Grade', desc: 'Studio-quality equipment for musicians and audiophiles' },
      { icon: '📻', title: 'Wide Compatibility', desc: 'Works with all your favorite devices and platforms' },
      { icon: '🎯', title: 'Precision Crafted', desc: 'Expertly designed for optimal acoustic performance' }
    ],

    // Sports
    sports: [
      { icon: '🏃', title: 'Peak Performance', desc: 'Engineered for competitive advantage' },
      { icon: '💪', title: 'Durable Build', desc: 'Withstands intense training and competition' },
      { icon: '🎯', title: 'Precision Engineering', desc: 'Every detail optimized for performance' },
      { icon: '🏆', title: 'Professional Quality', desc: 'Trusted by athletes and professionals' }
    ],

    // Office
    office: [
      { icon: '📊', title: 'Productivity Boost', desc: 'Tools designed to enhance work efficiency' },
      { icon: '🖥️', title: 'Professional Quality', desc: 'Business-grade reliability and performance' },
      { icon: '📋', title: 'Organization Made Easy', desc: 'Keep your workspace neat and efficient' },
      { icon: '⚡', title: 'Fast & Reliable', desc: 'Dependable performance for daily business needs' }
    ],

    // Games
    games: [
      { icon: '🎮', title: 'Immersive Gaming', desc: 'Cutting-edge graphics and engaging gameplay' },
      { icon: '🏆', title: 'Competitive Edge', desc: 'High-performance equipment for serious gamers' },
      { icon: '👥', title: 'Multiplayer Ready', desc: 'Perfect for solo play or gaming with friends' },
      { icon: '⚡', title: 'Lightning Fast', desc: 'Smooth performance with minimal lag and loading times' }
    ],

    // Tools & Home Improvement
    tools: [
      { icon: '💪', title: 'Professional Grade', desc: 'Built to withstand heavy-duty professional use' },
      { icon: '🎯', title: 'Precision Control', desc: 'Accurate results with ergonomic design' },
      { icon: '🔧', title: 'Versatile Use', desc: 'Multiple applications for various projects' },
      { icon: '⚡', title: 'Efficient Power', desc: 'Maximum performance with optimal energy use' }
    ],

    // Lawn Mowers
    'lawn mowers': [
      { icon: '🌱', title: 'Perfect Cut', desc: 'Precision cutting for a beautiful, healthy lawn' },
      { icon: '💪', title: 'Powerful Engine', desc: 'Reliable performance for any lawn size' },
      { icon: '🔧', title: 'Easy Maintenance', desc: 'Simple upkeep with accessible parts and filters' },
      { icon: '⏰', title: 'Time Saving', desc: 'Efficient cutting patterns reduce mowing time' }
    ]
  };

  // Default/Generic highlights for unknown categories
  const defaultHighlights = [
    { icon: '⭐', title: 'Premium Quality', desc: 'Built with high-grade materials for durability and performance' },
    { icon: '🛡️', title: 'Reliable & Trusted', desc: 'Backed by excellent customer service and warranty' },
    { icon: '🎯', title: 'User-Friendly', desc: 'Intuitive design that\'s easy to set up and use' },
    { icon: '📞', title: 'Support Included', desc: 'Comprehensive customer support and documentation' }
  ];

  // Now call getFeatures with all required parameters
  return getFeatures(category, categoryHighlights, defaultHighlights);
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
<div className="breadcrumbs">
  <Link to={`/category/${encodeURIComponent(product.SourceCategory.toLowerCase())}`}>
    {product.SourceCategory}
  </Link>
  <Link to={`/category/${encodeURIComponent(product.SourceCategory.toLowerCase())}/${encodeURIComponent(product.category.toLowerCase())}`}>
    {product.category}
  </Link>
  <span className="current-product">{product.brand}</span>
</div>
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
  {displayStorageName ? `${displayStorageName}GB` : product.product_name}</h1>
              
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
{product.category?.toLowerCase() === 'automotive' && product.colors && (
  <div className="product-configuration">
    <div className="config-section">
      <h1 className="product-title">{product.model || product.product_name}</h1>

      {/* Color Selector */}
      <div className="section">
        <h2>Color</h2>
        <div className="color-options">
          {product.colors.map((color) => (
            <div
              key={color.code}
              className={`color-circle ${
                selectedCarColor === color.code ? 'selected' : ''
              }`}
              style={{ backgroundColor: color.hex }}
              onClick={() => setSelectedCarColor(color.code)}
              title={color.name}
            />
          ))}
        </div>
        <p className="selected-color-name">
          {product.colors.find(c => c.code === selectedCarColor)?.name || 'Select a color'}
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
                onChange={() => setSelectedWheels(wheel.code)} 
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
                onChange={() => setSelectedInterior(interior.code)} 
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
                onChange={() => setSelectedAutopilot(pkg.code)} 
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
                type="checkbox" 
                checked={selectedExtras.some(e => e.name === extra.name)}
                onChange={() => {
                  const isSelected = selectedExtras.some(e => e.name === extra.name);
                  if (isSelected) {
                    setSelectedExtras(selectedExtras.filter(e => e.name !== extra.name));
                  } else {
                    setSelectedExtras([...selectedExtras, extra]);
                  }
                }} 
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
              <span>{product.colors?.find(c => c.code === selectedCarColor)?.name || 'Not selected'}</span>
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

        {/* Quantity and Total */}
        <div className="quantity-total-section">
          <label className="quantity-label">
            Quantity:
            <input
              type="number"
              min={1}
              max={10}
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="quantity-input"
            />
          </label>
          <div className="total-price-display">
            Total: ${(configPrice * quantity).toLocaleString()}
          </div>
        </div>

        <button 
          className="add-to-cart-btn car-config-btn"
          onClick={() => handleCartButtonClick(product)}
        >
          Add to Cart - ${(configPrice * quantity).toLocaleString()}
        </button>
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