/* eslint-disable no-unused-vars */
import  { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { auth, db } from '../db/firebase';
import { User, Edit3, Save, X, Package, MapPin, CreditCard, Bell, Shield, Heart, Trash2, ShoppingCart, ExternalLink,Settings  } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SecNav from '../components/SecNav';
import { wishlistHandlers } from '../utils/wishlistHandler'; 
import { priceUtils } from '../utils/priceUtils'; 


export default function Profile() {
 
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderHistory, setOrderHistory] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [securitySettings, setSecuritySettings] = useState({});
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
const [searchParams] = useSearchParams();
const defaultTab = searchParams.get("tab") || "account";
const [activeTab, setActiveTab] = useState(defaultTab);  
const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
const implementedTabs = ['account', 'wishlist', 'orders', 'cookies','security','notifications'];  
const [cookieSettings, setCookieSettings] = useState({
  necessary: true, // Always true, can't be disabled
  analytics: true,
  marketing: false,
  functional: true,
  preferences: true
});
 
  // Wishlist specific states
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };

  // Load user's wishlist
  const loadWishlist = async (userId) => {
    setWishlistLoading(true);
    try {
      const result = await wishlistHandlers.getUserWishlist(userId);
      if (result.success) {
        setWishlistItems(result.wishlist);
      } else {
        showToast('Error loading wishlist', 'error');
      }
    } catch (error) {
      showToast('Error loading wishlist', 'error');
    } finally {
      setWishlistLoading(false);
    }
  };

  // Remove item from wishlist
const handleClearWishlist = async () => {
  if (!auth.currentUser) return;
  if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
    setWishlistLoading(true);
    try {
      const result = await wishlistHandlers.clearWishlist(auth.currentUser.uid);
      if (result.success) {
        setWishlistItems([]);
        showToast('Wishlist cleared successfully', 'success');
      } else {
        showToast('Error clearing wishlist', 'error');
      }
    } catch (error) {
      showToast('Error clearing wishlist', 'error');
    } finally {
      setWishlistLoading(false);
    }
  }
};


  const handleRemoveFromWishlist = async (productId) => {
    if (!auth.currentUser) return;
    
    setRemovingItem(productId);
      if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
    try {
      const result = await wishlistHandlers.removeFromWishlist(auth.currentUser.uid, productId);
      if (result.success) {
        setWishlistItems(prev => prev.filter(item => item.productId !== productId));
        showToast('Item removed from wishlist', 'success');
      } else {
        showToast('Error removing item from wishlist', 'error');
      }
    } catch (error) {
      showToast('Error removing item from wishlist', 'error');
    } finally {
      setRemovingItem(null);
    }
  }
  };
 useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(true);

      if (user) {
        try {
          // Load user profile data
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const data = userDocSnapshot.data();
            setUserData(data);
            setFormData(data);
          } else {
            const defaultData = {
              fname: '',
              lname: '',
              email: user.email,
              phone: '',
              address: '',
              city: '',
              state: '',
              zipcode: '',
              country: 'United States',
              createdAt: new Date(),
              updatedAt: new Date()
            };
            setUserData(defaultData);
            setFormData(defaultData);
          }

          // Load wishlist
          await loadWishlist(user.uid);

          // Load cookie settings
          await loadCookieSettings(user.uid);

          // Load orders using the new method
          await loadUserOrders(user.uid);

          setIsSignedIn(true);
        } catch (error) {
showToast("Error loading profile data. Please try again.", "error");
          setOrderHistory([]);
          setIsSignedIn(true); // still signed in
        }
      } else {
        setUserData(null);
        setOrderHistory([]);
        setIsSignedIn(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [ ]);

  

  // Reload wishlist when switching to wishlist tab
  useEffect(() => {
    if (activeTab === 'wishlist' && auth.currentUser && !wishlistLoading) {
      loadWishlist(auth.currentUser.uid);
    }
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const updatedData = {
          ...formData,
          updatedAt: new Date()
        };
        
        // Use setDoc to create or update the document
        await setDoc(userDocRef, updatedData, { merge: true });
        
        setUserData(updatedData);
        setEditing(false);
        
        showToast('Profile updated successfully!', 'success');
      }
    } catch (error) {
      showToast('Error updating profile. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // const handleCancel = () => {
  //   setFormData(userData);
  //   setEditing(false);
  // };

  const loadCookieSettings = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists() && userDoc.data().cookieSettings) {
      setCookieSettings(userDoc.data().cookieSettings);
    }
  } catch (error) {
    showToast('Error loading cookie settings. Please try again.', 'error');
  }
};

const saveCookieSettings = async () => {
  if (!auth.currentUser) return;
  
  setSaving(true);
  try {
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    await setDoc(userDocRef, { 
      cookieSettings: cookieSettings,
      updatedAt: new Date()
    }, { merge: true });
    
    // Apply cookie settings to the browser
    applyCookieSettings(cookieSettings);
    
    showToast('Cookie preferences updated successfully!', 'success');
  } catch (error) {
    showToast('Error updating cookie preferences. Please try again.', 'error');
  } finally {
    setSaving(false);
  }
};

const applyCookieSettings = (settings) => {
  // Store the settings in localStorage for immediate access
  localStorage.setItem('cookieSettings', JSON.stringify(settings));
  
  // If analytics is disabled, you might want to disable Google Analytics, etc.
  if (!settings.analytics) {
    // Disable analytics tracking
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  } else {
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  }
  
  // Handle marketing cookies
  if (!settings.marketing) {
    // Disable marketing/advertising cookies
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'ad_storage': 'denied'
      });
    }
  } else {
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'ad_storage': 'granted'
      });
    }
  }
};

const handleCookieToggle = (cookieType) => {
  if (cookieType === 'necessary') return; // Can't disable necessary cookies
  
  setCookieSettings(prev => ({
    ...prev,
    [cookieType]: !prev[cookieType]
  }));
};

const loadUserOrders = async (userId) => {
    try {
      // Query orders collection where customer.uid matches the user ID
      const ordersQuery = query(
        collection(db, "orders"), 
        where("customer.uid", "==", userId)
      );
      
      const querySnapshot = await getDocs(ordersQuery);
      const orders = [];
      
      querySnapshot.forEach((doc) => {
        const orderData = doc.data();
        orders.push({
          orderId: doc.id, // This will be the document ID like "1750636623877"
          ...orderData
        });
      });
      
      // Sort orders by creation date (newest first)
      orders.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
        return dateB - dateA;
      });
      
      setOrderHistory(orders);
      
    } catch (error) {
      setOrderHistory([]);
    }
  };

const handleAddToCart = async (productId, quantity = 1, productData = {}) => {
  try {
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      showToast && showToast('Please log in to add items to cart');
      return { success: false, message: 'User not authenticated' };
    }

    // Validate required parameters
    if (!productId || !productData) {
      showToast && showToast('Invalid product data', 'error');
      return { success: false, message: 'Invalid product data' };
    }

    // Use the current price
    const currentPrice = productData.price;
    if (!currentPrice || currentPrice <= 0) {
      showToast && showToast('Invalid product price', 'error');
      return { success: false, message: 'Invalid product price' };
    }

    const totalPrice = currentPrice * quantity;

    // Create cart item object
    const cartItem = {
      productId: productId,
      productName: productData.product_name || productData.name,
      price: currentPrice,
      quantity: quantity,
      totalPrice: totalPrice,
      description: productData.description || 'No description available',
      brandName: productData.brand_name || productData.brand || 'Unknown',
      category: productData.category || 'General',
      imgUrl: productData.imgUrl || 'default-product.jpg',
      brand: productData.brand || 'Unknown',
      stock: productData.stock || 'In Stock',
      hasPrime: productData.gpremium || false,
      seller: productData.seller || 'Gulime',
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      warranty: productData.warranty || '1 Year',
      addedAt: new Date().toISOString()
    };

    // Remove any undefined values to prevent Firestore errors
    Object.keys(cartItem).forEach(key => {
      if (cartItem[key] === undefined) {
        delete cartItem[key];
      }
    });

    // Reference to user's cart document
    const cartRef = doc(db, 'carts', user.uid);

    // Get existing cart
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      // Cart exists, update it
      const existingCart = cartDoc.data();
      const existingItems = existingCart.items || [];

      // Check if product already exists in cart
      const existingItemIndex = existingItems.findIndex(item => item.productId === cartItem.productId);

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        existingItems[existingItemIndex].quantity += quantity;
        existingItems[existingItemIndex].totalPrice =
          existingItems[existingItemIndex].price * existingItems[existingItemIndex].quantity;
      } else {
        // Add new item to cart
        existingItems.push(cartItem);
      }

      // Calculate totals
      const totalItems = existingItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalValue = existingItems.reduce((sum, item) => sum + item.totalPrice, 0);

      // Update cart document
      await updateDoc(cartRef, {
        items: existingItems,
        updatedAt: new Date().toISOString(),
        totalItems: totalItems,
        totalValue: totalValue
      });
    } else {
      // Create new cart
      await setDoc(cartRef, {
        userId: user.uid,
        items: [cartItem],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalItems: quantity,
        totalValue: totalPrice
      });
    }

    // Show success toast if function is provided
    if (showToast) {
      const displayName = productData.product_name || productData.name;
      showToast(`Added ${quantity} ${displayName} to cart!`, 'success');
    }

    return {
      success: true,
      message: `Added ${quantity} item(s) to cart!`,
      shouldNavigate: true
    };

  } catch (error) {

    // Show error toast if function is provided
    if (showToast) {
      showToast('Failed to add item to cart. Please try again.', 'error');
    }

    return {
      success: false,
      message: 'Failed to add item to cart. Please try again.',
      error: error.message
    };
  }
};
  if (loading) {
    return (
      <>
        <Navbar />
        <SecNav />
        <div className="profile-header">
          <h1>Profile</h1>
          <p>Manage your profile details below</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  const fullName = `${userData?.fname || ''} ${userData?.lname || ''}`.trim() || 'User';
  const { formatPrice } = priceUtils;

  const tabs = [
    { id: 'account', label: 'Account Info', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'cookies', label: 'Cookie Settings', icon: Settings } // New tab
  ];

  return (
    <>
      <Navbar />
      <SecNav />
      <div className="profile-header">
        <h1>Profile</h1>
        <p>Manage your profile details below</p>
      </div>
      
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header-card">
          <div className="profile-avatar">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{fullName}</h1>
            <p className="profile-email">{userData?.email}</p>
            <p className="profile-status">✓ Verified Account</p>
          </div>
       {activeTab === 'account' && (
  <button
    className={`edit-btn ${editing ? 'cancel' : 'edit'}`}
    onClick={() => setEditing(!editing)}
    disabled={saving}
  >
    {editing ? <X size={16} /> : <Edit3 size={16} />}
    {editing ? 'Cancel' : 'Edit Profile'}
  </button>
)}

        </div>

        {/* Navigation Tabs */}
        <div className="tabs-container">
          <div className="tabs-nav">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <IconComponent size={16} />
                  {tab.label}
                  {tab.id === 'wishlist' && wishlistItems.length > 0 && (
                    <span className="tab-badge">{wishlistItems.length}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'account' && (
            <div className="account-section">
              <div className="section-header">
                <h2>Account Information</h2>
                {editing && (
                  <div className="action-buttons">
                    {/* <button 
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </button> */}
                    <button
                      className="btn btn-primary"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      <Save size={14} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="fname"
                    value={formData.fname || ''}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={editing ? 'editing' : ''}
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lname"
                    value={formData.lname || ''}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={editing ? 'editing' : ''}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={editing ? 'editing' : ''}
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={editing ? 'editing' : ''}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={editing ? 'editing' : ''}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={editing ? 'editing' : ''}
                  />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={editing ? 'editing' : ''}
                  />
                </div>

                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="zipcode"
                    value={formData.zipcode || ''}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={editing ? 'editing' : ''}
                  />
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <select
                    name="country"
                    value={formData.country || 'United States'}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={editing ? 'editing' : ''}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Mexico">Mexico</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          {/* account tab stops here */}

        {/* orders tab begins here */}
{activeTab === 'orders' && (
  <div className="orders-section">
    <div className="section-header">
      <h2>Order History</h2>
      <p className="section-subtitle">
        {orderHistory.length} {orderHistory.length === 1 ? 'order' : 'orders'} placed
      </p>
    </div>
{orderHistory.length === 0 ? (
  <div className="empty-orders">
    <Package size={64} className="empty-icon" />
    <h3>No orders yet</h3>
    <p>When you place your first order, it will appear here.</p>
    <Link to="/" className="btn btn-primary">
      Start Shopping
    </Link>
  </div>
) : (
  <div className="orders-list">
    {orderHistory
      .sort((a, b) => {
        // Handle Firebase serverTimestamp objects
        const dateA = a.createdAt?._methodName ? new Date() : new Date(a.createdAt || a.orderDate);
        const dateB = b.createdAt?._methodName ? new Date() : new Date(b.createdAt || b.orderDate);
        return dateB - dateA;
      })
      .map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <div className="order-info">
              <h3>Order #{order.id}</h3>
              <p className="order-date">
                Placed on {(() => {
                  // Handle Firebase serverTimestamp
                  if (order.createdAt?._methodName) {
                    return new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                  }
                  const orderDate = order.createdAt || order.orderDate;
                  return new Date(orderDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                })()}
              </p>
              {/* Add last updated timestamp */}
              <p className="order-updated">
                Last updated: {(() => {
                  if (order.updatedAt?._methodName) {
                    return new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                  }
                  return order.updatedAt ? new Date(order.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A';
                })()}
              </p>
            </div>
            <div className="order-status">
              <span className={`status-badge ${order.status?.toLowerCase() || 'pending'}`}>
                {order.status || 'Pending'}
              </span>
              <span className="order-total">
                ${formatPrice(order.summary?.grandTotal || order.totalPrice || order.paidAmount)}
              </span>
            </div>
          </div>

          <div className="order-items">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                    <img 
                      src={`/assets/images/${item.imgUrl || item.image || 'placeholder.jpg'}`}
                      alt={item.productName || item.name || item.title}
                      onError={(e) => {
                        e.target.src = '/assets/images/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="item-details">
                    <Link to={`/product/${item.productId || item.id}`}>
                      <h4 className='cart-item-title'>{(() => {
                        const productName = item.productName || item.name || item.title;
                        
                        // Check if product name ends with a number (likely storage size)
                        // and doesn't already contain storage units (GB, TB, MB)
                        const hasStorageUnits = /\b(GB|TB|MB|gb|tb|mb)\b/i.test(productName);
                        const endsWithNumber = /\d+$/.test(productName?.trim());
                        
                        // Categories that typically have storage
                        const storageCategories = ['tablets', 'phones', 'laptops', 'computers', 'storage', 'memory'];
                        const isStorageProduct = storageCategories.some(cat => 
                          item.category?.toLowerCase().includes(cat.toLowerCase())
                        );
                        
                        // Append GB if it's a storage product, ends with a number, and doesn't already have storage units
                        if (isStorageProduct && endsWithNumber && !hasStorageUnits) {
                          return `${productName}GB`;
                        }
                        
                        return productName;
                      })()}</h4>
                    </Link>
                    <Link className='cart-item-title' to="/">Keep Shopping</Link>
                    <p className="item-price">${formatPrice(item.price)} × {item.quantity || 1}</p>
                    {item.size && <p className="item-size">Size: {item.size}</p>}
                    {item.color && <p className="item-color">Color: {item.color}</p>}
                    {item.condition && <p className="item-condition">Condition: {item.condition}</p>}
                    {item.category && <p className="item-category">Category: {item.category}</p>}
                    {item.seller && <p className="item-seller">Sold by: {item.seller}</p>}
                    {item.brand && <p className="item-brand">Brand: {item.brand}</p>}
                    {item.hasPrime && <p className="item-prime">Gulime Premium</p>}
                    {item.automotiveConfig && <p className="item-auto-config">Config: {item.automotiveConfig}</p>}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-items">No items found for this order</p>
            )}
          </div>

          <div className="order-footer">
            <div className="order-details">
              {/* Customer Information */}
              {order.customer && (
                <div className="customer-info">
                  <strong>Customer Details:</strong>
                  <p>Name: {order.customer.name}</p>
                  <p>Email: {order.customer.email}</p>
                  {order.customer.phone && <p>Phone: {order.customer.phone}</p>}
                  {order.customer.address && (
                    <div className="shipping-info">
                      <strong>Shipping Address:</strong>
                      <p>{order.customer.address}</p>
                    </div>
                  )}
                  {order.customer.city && <p>City: {order.customer.city}</p>}
                  {order.customer.state && <p>State: {order.customer.state}</p>}
                  {order.customer.zip && <p>ZIP: {order.customer.zip}</p>}
                  {order.customer.country && <p>Country: {order.customer.country}</p>}
                  <p>User ID: {order.customer.uid}</p>
                </div>
              )}

              {/* Order Summary */}
              {order.summary && (
                <div className="order-summary">
                  <strong>Order Summary:</strong>
                  <p>Total Items: {order.summary.totalItems}</p>
                  <p>Subtotal: ${formatPrice(order.summary.totalPrice)}</p>
                  <p>Total Value: ${formatPrice(order.summary.totalValue)}</p>
                  {order.summary.totalTax > 0 && <p>Tax: ${formatPrice(order.summary.totalTax)}</p>}
                  {order.summary.totalDiscount > 0 && <p>Discount: -${formatPrice(order.summary.totalDiscount)}</p>}
                  <p><strong>Grand Total: ${formatPrice(order.summary.grandTotal)}</strong></p>
                </div>
              )}

              {/* Payment Details */}
              {order.paymentDetails && (
                <div className="payment-info">
                  <strong>Payment Details:</strong>
                  <p>Card: {order.paymentDetails.cardBrand} ending in {order.paymentDetails.cardLast4}</p>
                  <p>Amount Paid: ${formatPrice(order.paymentDetails.amount)}</p>
                  <p>Currency: {order.paymentDetails.currency?.toUpperCase()}</p>
                  <p>Payment Status: {order.paymentDetails.paymentStatus}</p>
                  <p>Customer Email: {order.paymentDetails.customerEmail}</p>
                

                </div>
              )}

              {/* Delivery Information */}
              {order.deliveryOption && (
                <div className="delivery-info">
                  <strong>Delivery Details:</strong>
                  <p>Option: {order.deliveryOption}</p>
                  <p>Fee: ${formatPrice(order.deliveryFee || 0)}</p>
                </div>
              )}

              {/* Additional Order Information */}
            

              {/* Tracking Information (if available) */}
              {order.trackingNumber && (
                <div className="tracking-info">
                  <strong>Tracking:</strong>
                  <p>Tracking Number: {order.trackingNumber}</p>
                </div>
              )}
            </div>
      
            <div className="order-actions"> 
              <Link to="/" className="continue-shopping-link">
                Keep Shopping
              </Link>
            </div>
          </div>
        </div>
      ))}
  </div>
)}

            </div>
          )}



          {/* wishlist tab */}
          {activeTab === 'wishlist' && (
  <div className="wishlist-section">
    <div className="section-header">
      <h2>My Wishlist</h2>
      <p className="section-subtitle">
        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
      </p>
    </div>

    {wishlistLoading ? (
      <div className="wishlist-loading">
        <div className="loading-spinner"></div>
        <p>Loading your wishlist...</p>
      </div>
    ) : wishlistItems.length === 0 ? (
      <div className="empty-wishlist">
        <Heart size={64} className="empty-icon" />
        <h3>Your wishlist is empty</h3>
        <p>Save items you love to your wishlist and they&apos;ll appear here.</p>
        <Link to="/" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    ) : (
      <div className="wishlist-grid">
        {wishlistItems.map((item) => (
          <div key={item.productId} className="wishlist-item-card">
            {/* Product Image */}
            <div className="wishlist-item-image">
              <img 
                src={`/assets/images/${item.productImage || item.productData?.imgUrl || 'placeholder.jpg'}`}
                alt={item.productName || item.productData?.product_name}
                onError={(e) => {
                  e.target.src = '/assets/images/placeholder.jpg';
                }}
              />
           
              {item.productData?.condition && (
                <span className={`condition-badge ${item.productData.condition.toLowerCase()}`}>
                  {item.productData.condition}
                </span>
              )}
            </div>

            {/* Product Details */}
            <div className="wishlist-item-details">
              <Link to={`/product/${item.productId}`} className="product-link">
                <h4 className="product-title">
                  {item.productName || item.productData?.product_name}
                </h4>
              </Link>
              
              <p className="product-description">
                {item.productData?.description && item.productData.description.length > 100 
                  ? `${item.productData.description.substring(0, 100)}...`
                  : item.productData?.description
                }
              </p>

              <div className="product-meta">
                <span className="product-category">
                  {item.productCategory || item.productData?.category}
                </span>
                {item.productData?.brand && (
                  <span className="product-brand">
                    {item.productData.brand}
                  </span>
                )}
              </div>

              {/* Product Specifications Preview */}
              {item.productData?.specifications && (
                <div className="product-specs-preview">
                  {item.productData.screen_size && (
                    <span className="spec-item">
                      📱 {item.productData.screen_size}
                    </span>
                  )}
                  {item.productData.specifications.chip?.model && (
                    <span className="spec-item">
                      🔧 {item.productData.specifications.chip.model}
                    </span>
                  )}
                  {item.productData.storageDetails && (
                    <span className="spec-item">
                      💾 {item.productData.storageDetails}
                    </span>
                  )}
                </div>
              )}

              {/* Available Colors */}
              {item.productData?.availableColors?.colors && (
                <div className="available-colors">
                  <span className="colors-label">Colors:</span>
                  <div className="color-options">
                    {item.productData.availableColors.colors
                      .filter(color => color.available)
                      .slice(0, 4)
                      .map((color, index) => (
                        <div 
                          key={index}
                          className="color-swatch"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        ></div>
                      ))}
                    {item.productData.availableColors.colors.filter(c => c.available).length > 4 && (
                      <span className="more-colors">
                        +{item.productData.availableColors.colors.filter(c => c.available).length - 4}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Storage Options */}
              {item.productData?.storageOptions?.storage && (
                <div className="storage-options">
                  <span className="storage-label">Storage:</span>
                  <div className="storage-variants">
                    {item.productData.storageOptions.storage
                      .filter(storage => storage.available)
                      .slice(0, 3)
                      .map((storage, index) => (
                        <span key={index} className="storage-option">
                          {storage.size}GB
                          {storage.popular && <span className="popular-tag">Popular</span>}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Rating */}
              {item.productData?.rating && (
                <div className="product-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`star ${i < item.productData.rating ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="rating-text">
                    {item.productData.rating}/5
                    {item.productData.totalReviews && (
                      <span className="review-count">
                        ({item.productData.totalReviews} {item.productData.totalReviews === 1 ? 'review' : 'reviews'})
                      </span>
                    )}
                  </span>
                </div>
              )}

              {/* Price and Actions */}
              <div className="wishlist-item-footer">
                <div className="price-section">
                  <span className="current-price">
                    ${formatPrice(item.productData?.price || 0)}
                  </span>
                  {item.productData?.seller && (
                    <span className="seller-info">
                      Seller {item.productData.seller}
                    </span>
                  )}
                </div>

                <div className="item-actions">
                  <Link 
                    to={`/product/${item.productId}`}
                    className="cart-link"
                  >
                    <ExternalLink size={14} />
                    View Details
                  </Link>
                  
                  <button
                    className="no-page-button"
                    onClick={() => handleAddToCart(item.productId, 1, item.productData)}
                    disabled={item.productData?.stock === 'Out of Stock'}
                  >
                    <ShoppingCart size={14} />
                    {item.productData?.stock === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  
                  <button
                    className="footer-newsletterbtn"
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    disabled={removingItem === item.productId}
                  >
                    {removingItem === item.productId ? (
                      <div className="btn-loading"></div>
                    ) : (
                      <Trash2 size={14} />
                    )}
                    Remove
                  </button>
                </div>
              </div>

              {/* Added Date */}
              <div className="wishlist-meta">
                <span className="added-date">
                  Added on {new Date(item.addedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Wishlist Actions */}
    {wishlistItems.length > 0 && (
      <div className="wishlist-actions">
        <button 
          className="footer-newsletterbtn "
          onClick={() => handleClearWishlist()}
        >
          Clear All Items
        </button>
        <Link to="/" className="no-page-button">
          Continue Shopping
        </Link>
      </div>
    )}
  </div>
)}

          {/* wishlist tab stops */}
          {/* security tab starts here */}
{/* Security Tab - Add this inside the tab content section */}
{activeTab === 'security' && (
  <div className="security-section">
    <div className="section-header">
      <h2>Security Settings</h2>
      <p className="section-subtitle">
        Keep your account secure with these security features
      </p>
    </div>

    <div className="security-content">
      {/* Password Section */}
      <div className="security-card">
        <div className="security-card-header">
          <div className="security-card-icon">
            <Shield size={24} />
          </div>
          <div className="security-card-info">
            <h3>Password</h3>
            <p>Last changed: 2 months ago</p>
          </div>
          <button className="security-action-btn">
            Change Password
          </button>
        </div>
        <div className="security-card-details">
          <div className="password-strength">
            <span className="strength-label">Password Strength:</span>
            <div className="strength-indicator strong">
              <div className="strength-bar"></div>
            </div>
            <span className="strength-text">Strong</span>
          </div>
          <p className="security-tip">
            Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
          </p>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="security-card">
        <div className="security-card-header">
          <div className="security-card-icon">
            <Shield size={24} />
          </div>
          <div className="security-card-info">
            <h3>Two-Factor Authentication</h3>
            <p>Add an extra layer of security to your account</p>
          </div>
          <div className="security-toggle">
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={securitySettings.twoFactorEnabled || false}
                onChange={() => setSecuritySettings(prev => ({
                  ...prev,
                  twoFactorEnabled: !prev.twoFactorEnabled
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
        <div className="security-card-details">
          {securitySettings.twoFactorEnabled ? (
            <div className="two-factor-enabled">
              <p className="security-status enabled">✓ Two-factor authentication is enabled</p>
              <div className="backup-codes">
                <h4>Backup Codes</h4>
                <p>Save these backup codes in case you lose access to your authenticator app:</p>
                <div className="backup-codes-list">
                  <code>1234-5678</code>
                  <code>8765-4321</code>
                  <code>2468-1357</code>
                  <code>9753-8642</code>
                </div>
                <button className="security-action-btn secondary">
                  Generate New Codes
                </button>
              </div>
            </div>
          ) : (
            <div className="two-factor-disabled">
              <p className="security-status disabled">Two-factor authentication is disabled</p>
              <p>Enable 2FA to secure your account with your phone or authenticator app.</p>
              <button className="security-action-btn">
                Enable 2FA
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Login Activity */}
      <div className="security-card">
        <div className="security-card-header">
          <div className="security-card-icon">
            <User size={24} />
          </div>
          <div className="security-card-info">
            <h3>Recent Login Activity</h3>
            <p>Monitor your account access</p>
          </div>
          <button className="security-action-btn secondary">
            View All Activity
          </button>
        </div>
        <div className="security-card-details">
          <div className="login-activity-list">
            <div className="login-activity-item current">
              <div className="activity-info">
                <div className="activity-location">
                  <strong>Current Session</strong>
                  <span className="activity-device">Chrome on Windows</span>
                </div>
                <div className="activity-details">
                  <span className="activity-ip">192.168.1.100</span>
                  <span className="activity-time">Active now</span>
                </div>
              </div>
              <div className="activity-status current-session">Current</div>
            </div>
            
            <div className="login-activity-item">
              <div className="activity-info">
                <div className="activity-location">
                  <strong>Chattanooga, TN</strong>
                  <span className="activity-device">Safari on iPhone</span>
                </div>
                <div className="activity-details">
                  <span className="activity-ip">192.168.1.105</span>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
              <button className="activity-action">Sign Out</button>
            </div>

            <div className="login-activity-item">
              <div className="activity-info">
                <div className="activity-location">
                  <strong>Nashville, TN</strong>
                  <span className="activity-device">Chrome on Android</span>
                </div>
                <div className="activity-details">
                  <span className="activity-ip">10.0.0.45</span>
                  <span className="activity-time">Yesterday</span>
                </div>
              </div>
              <div className="activity-status">Signed out</div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="security-card">
        <div className="security-card-header">
          <div className="security-card-icon">
            <Shield size={24} />
          </div>
          <div className="security-card-info">
            <h3>Privacy Settings</h3>
            <p>Control how your data is used</p>
          </div>
        </div>
        <div className="security-card-details">
          <div className="privacy-settings">
            <div className="privacy-option">
              <div className="privacy-option-info">
                <h4>Profile Visibility</h4>
                <p>Control who can see your profile information</p>
              </div>
              <select className="privacy-select">
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div className="privacy-option">
              <div className="privacy-option-info">
                <h4>Order History Visibility</h4>
                <p>Who can see your purchase history</p>
              </div>
              <select className="privacy-select">
                <option value="private">Only Me</option>
                <option value="family">Family Members</option>
              </select>
            </div>

            <div className="privacy-option">
              <div className="privacy-option-info">
                <h4>Activity Status</h4>
                <p>Show when you were last active</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={securitySettings.showActivityStatus || false}
                  onChange={() => setSecuritySettings(prev => ({
                    ...prev,
                    showActivityStatus: !prev.showActivityStatus
                  }))}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="security-card danger">
        <div className="security-card-header">
          <div className="security-card-icon danger">
            <Trash2 size={24} />
          </div>
          <div className="security-card-info">
            <h3>Delete Account</h3>
            <p>Permanently delete your account and all data</p>
          </div>
          <button className="security-action-btn danger">
            Delete Account
          </button>
        </div>
        <div className="security-card-details">
          <p className="danger-warning">
            ⚠️ This action cannot be undone. All your data, orders, and account information will be permanently deleted.
          </p>
        </div>
      </div>
    </div>
  </div>
)}
          {/* security tab stops here */}

          {/* notifications tab starts here */}
{/* Notifications Tab - Add this inside the tab content section */}
{activeTab === 'notifications' && (
  <div className="notifications-section">
    <div className="section-header">
      <h2>Notification Settings</h2>
      <p className="section-subtitle">
        Choose how you want to be notified about orders, deals, and account activity
      </p>
    </div>

    <div className="notifications-content">
      {/* Email Notifications */}
      <div className="notification-category">
        <div className="notification-category-header">
          <div className="notification-category-icon">
            <Bell size={24} />
          </div>
          <div className="notification-category-info">
            <h3>Email Notifications</h3>
            <p>Receive updates via email</p>
          </div>
        </div>

        <div className="notification-options">
          <div className="notification-option">
            <div className="notification-option-info">
              <h4>Order Updates</h4>
              <p>Get notified about order confirmations, shipping, and delivery</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notifications.email?.orderUpdates ?? true}
                onChange={() => setNotifications(prev => ({
                  ...prev,
                  email: {
                    ...prev.email,
                    orderUpdates: !prev.email?.orderUpdates
                  }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-option">
            <div className="notification-option-info">
              <h4>Promotions & Deals</h4>
              <p>Special offers, discounts, and promotional campaigns</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notifications.email?.promotions ?? false}
                onChange={() => setNotifications(prev => ({
                  ...prev,
                  email: {
                    ...prev.email,
                    promotions: !prev.email?.promotions
                  }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-option">
            <div className="notification-option-info">
              <h4>Price Drops</h4>
              <p>When items in your wishlist go on sale</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notifications.email?.priceDrops ?? true}
                onChange={() => setNotifications(prev => ({
                  ...prev,
                  email: {
                    ...prev.email,
                    priceDrops: !prev.email?.priceDrops
                  }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-option">
            <div className="notification-option-info">
              <h4>Security Alerts</h4>
              <p>Important security notifications and login alerts</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notifications.email?.security ?? true}
                onChange={() => setNotifications(prev => ({
                  ...prev,
                  email: {
                    ...prev.email,
                    security: !prev.email?.security
                  }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-option">
            <div className="notification-option-info">
              <h4>Weekly Newsletter</h4>
              <p>Product recommendations and trending items</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notifications.email?.newsletter ?? false}
                onChange={() => setNotifications(prev => ({
                  ...prev,
                  email: {
                    ...prev.email,
                    newsletter: !prev.email?.newsletter
                  }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="notification-category">
        <div className="notification-category-header">
          <div className="notification-category-icon">
            <Bell size={24} />
          </div>
          <div className="notification-category-info">
            <h3>Push Notifications</h3>
            <p>Get instant notifications on your device</p>
          </div>
          <button className="notification-enable-btn">
            Enable Push Notifications
          </button>
        </div>

        <div className="notification-options">
          <div className="notification-option">
            <div className="notification-option-info">
              <h4>Order Status</h4>
              <p>Real-time updates on your orders</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notifications.push?.orderStatus ?? true}
                onChange={() => setNotifications(prev => ({
                  ...prev,
                  push: {
                    ...prev.push,
                    orderStatus: !prev.push?.orderStatus
                  }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-option">
            <div className="notification-option-info">
              <h4>Flash Sales</h4>
              <p>Limited-time offers and flash sales</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notifications.push?.flashSales ?? false}
                onChange={() => setNotifications(prev => ({
                  ...prev,
                  push: {
                    ...prev.push,
                    flashSales: !prev.push?.flashSales
                  }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-option">
            <div className="notification-option-info">
              <h4>Back in Stock</h4>
              <p>When out-of-stock items become available</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notifications.push?.backInStock ?? true}
                onChange={() => setNotifications(prev => ({
                  ...prev,
                  push: {
                    ...prev.push,
                    backInStock: !prev.push?.backInStock
                  }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* SMS Notifications */}
      <div className="notification-category">
        <div className="notification-category-header">
          <div className="notification-category-icon">
            <Bell size={24} />
          </div>
          <div className="notification-category-info">
            <h3>SMS Notifications</h3>
            <p>Text messages to your phone</p>
          </div>
        </div>

        <div className="notification-options">
          <div className="phone-number-section">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={handleInputChange}
                name="phone"
                placeholder="(555) 123-4567"
                className="phone-input"
              />
            </div>
          </div>

          <div className="notification-option">
            <div className="notification-option-info">
              <h4>Delivery Notifications</h4>
              <p>SMS updates when your package is out for delivery</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notifications.sms?.delivery ?? false}
                onChange={() => setNotifications(prev => ({
                  ...prev,
                  sms: {
                    ...prev.sms,
                    delivery: !prev.sms?.delivery
                  }
                }))}
                disabled={!formData.phone}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-option">
            <div className="notification-option-info">
              <h4>Security Codes</h4>
              <p>Two-factor authentication codes</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notifications.sms?.securityCodes ?? true}
                onChange={() => setNotifications(prev => ({
                  ...prev,
                  sms: {
                    ...prev.sms,
                    securityCodes: !prev.sms?.securityCodes
                  }
                }))}
                disabled={!formData.phone}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Notification Frequency */}
      <div className="notification-category">
        <div className="notification-category-header">
          <div className="notification-category-icon">
            <Bell size={24} />
          </div>
          <div className="notification-category-info">
            <h3>Notification Frequency</h3>
            <p>Control how often you receive notifications</p>
          </div>
        </div>

        <div className="notification-options">
          <div className="frequency-option">
            <div className="frequency-option-info">
              <h4>Email Frequency</h4>
              <p>How often should we send you promotional emails?</p>
            </div>
            <select 
              className="frequency-select"
              value={notifications.frequency?.email || 'weekly'}
              onChange={(e) => setNotifications(prev => ({
                ...prev,
                frequency: {
                  ...prev.frequency,
                  email: e.target.value
                }
              }))}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="never">Never</option>
            </select>
          </div>

          <div className="frequency-option">
            <div className="frequency-option-info">
              <h4>Push Notification Quiet Hours</h4>
              <p>Don't send push notifications during these hours</p>
            </div>
            <div className="time-range">
              <input 
                type="time" 
                value={notifications.quietHours?.start || '22:00'}
                onChange={(e) => setNotifications(prev => ({
                  ...prev,
                  quietHours: {
                    ...prev.quietHours,
                    start: e.target.value
                  }
                }))}
              />
              <span>to</span>
              <input 
                type="time" 
                value={notifications.quietHours?.end || '08:00'}
                onChange={(e) => setNotifications(prev => ({
                  ...prev,
                  quietHours: {
                    ...prev.quietHours,
                    end: e.target.value
                  }
                }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="notification-category">
        <div className="notification-category-header">
          <div className="notification-category-icon">
            <Bell size={24} />
          </div>
          <div className="notification-category-info">
            <h3>Recent Notifications</h3>
            <p>Your last 5 notifications</p>
          </div>
          <button className="notification-clear-btn">
            Clear All
          </button>
        </div>

        <div className="recent-notifications">
          <div className="notification-item unread">
            <div className="notification-icon order">📦</div>
            <div className="notification-content">
              <h4>Order Shipped</h4>
              <p>Your order #1750636623877 has been shipped and is on its way!</p>
              <span className="notification-time">2 hours ago</span>
            </div>
            <button className="notification-mark-read">Mark as Read</button>
          </div>

          <div className="notification-item">
            <div className="notification-icon promotion">🏷️</div>
            <div className="notification-content">
              <h4>Special Offer</h4>
              <p>Get 20% off on electronics this weekend only!</p>
              <span className="notification-time">1 day ago</span>
            </div>
          </div>

          <div className="notification-item">
            <div className="notification-icon wishlist">❤️</div>
            <div className="notification-content">
              <h4>Price Drop Alert</h4>
              <p>iPhone 15 Pro in your wishlist is now $50 off!</p>
              <span className="notification-time">2 days ago</span>
            </div>
          </div>

          <div className="notification-item">
            <div className="notification-icon security">🔒</div>
            <div className="notification-content">
              <h4>New Login Detected</h4>
              <p>We detected a new login from Chrome on Windows</p>
              <span className="notification-time">3 days ago</span>
            </div>
          </div>

          <div className="notification-item">
            <div className="notification-icon order">📦</div>
            <div className="notification-content">
              <h4>Order Delivered</h4>
              <p>Your order #1750625123456 has been delivered successfully</p>
              <span className="notification-time">1 week ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Settings */}
      <div className="notification-actions">
        <button
          className="btn btn-primary"
          onClick={() => {
            // Save notification settings logic here
            showToast('Notification settings updated successfully!', 'success');
          }}
          disabled={saving}
        >
          <Save size={14} />
          {saving ? 'Saving...' : 'Save Notification Settings'}
        </button>
      </div>
    </div>
  </div>
)}
          {/* notifications tab stops here */}

       


        {/* Cookie Settings Tab */}
                  {activeTab === 'cookies' && (
  <div className="cookies-section">
    <div className="section-header">
      <h2>Cookie Settings</h2>
      <p className="section-subtitle">
        Manage your cookie preferences to control how we use cookies on our site
      </p>
    </div>

    <div className="cookie-settings-content">
      <div className="cookie-info-banner">
        <h3>About Cookies</h3>
        <p>
          We use cookies to enhance your browsing experience, provide personalized content, 
          and analyze our traffic. You can choose which types of cookies you want to allow.
        </p>
      </div>

      <div className="cookie-categories">
        <div className="cookie-category">
          <div className="cookie-category-header">
            <div className="cookie-category-info">
              <h4>Necessary Cookies</h4>
              <p>Essential for the website to function properly. These cannot be disabled.</p>
            </div>
            <div className="cookie-toggle">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={cookieSettings.necessary}
                  disabled={true}
                />
                <span className="toggle-slider disabled"></span>
              </label>
            </div>
          </div>
          <div className="cookie-category-details">
            <p>These cookies are essential for you to browse the website and use its features, such as accessing secure areas of the site.</p>
          </div>
        </div>

        <div className="cookie-category">
          <div className="cookie-category-header">
            <div className="cookie-category-info">
              <h4>Analytics Cookies</h4>
              <p>Help us understand how visitors interact with our website.</p>
            </div>
            <div className="cookie-toggle">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={cookieSettings.analytics}
                  onChange={() => handleCookieToggle('analytics')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div className="cookie-category-details">
            <p>These cookies collect information about how you use our website, which pages you visit, and any errors you encounter.</p>
          </div>
        </div>

        <div className="cookie-category">
          <div className="cookie-category-header">
            <div className="cookie-category-info">
              <h4>Marketing Cookies</h4>
              <p>Used to deliver personalized advertisements relevant to you.</p>
            </div>
            <div className="cookie-toggle">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={cookieSettings.marketing}
                  onChange={() => handleCookieToggle('marketing')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div className="cookie-category-details">
            <p>These cookies track your browsing habits to enable us to show advertising which is more likely to be of interest to you.</p>
          </div>
        </div>

        <div className="cookie-category">
          <div className="cookie-category-header">
            <div className="cookie-category-info">
              <h4>Functional Cookies</h4>
              <p>Enable enhanced functionality and personalization.</p>
            </div>
            <div className="cookie-toggle">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={cookieSettings.functional}
                  onChange={() => handleCookieToggle('functional')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div className="cookie-category-details">
            <p>These cookies allow the website to remember choices you make and provide enhanced, more personal features.</p>
          </div>
        </div>

        <div className="cookie-category">
          <div className="cookie-category-header">
            <div className="cookie-category-info">
              <h4>Preference Cookies</h4>
              <p>Remember your preferences and settings.</p>
            </div>
            <div className="cookie-toggle">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={cookieSettings.preferences}
                  onChange={() => handleCookieToggle('preferences')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div className="cookie-category-details">
            <p>These cookies remember your preferences such as language, region, or theme settings.</p>
          </div>
        </div>
      </div>

      <div className="cookie-actions">
        <button
          className="btn btn-primary"
          onClick={saveCookieSettings}
          disabled={saving}
        >
          <Save size={14} />
          {saving ? 'Saving...' : 'Save Cookie Preferences'}
        </button>
        
        <button
          className="btn btn-secondary"
          onClick={() => {
            setCookieSettings({
              necessary: true,
              analytics: false,
              marketing: false,
              functional: false,
              preferences: false
            });
          }}
        >
          Accept Only Necessary
        </button>
        
        <button
          className="btn-primary btn-secondary"
          onClick={() => {
            setCookieSettings({
              necessary: true,
              analytics: true,
              marketing: true,
              functional: true,
              preferences: true
            });
          }}
        >
          Accept All Cookies
        </button>
      </div>

      <div className="cookie-info-footer">
        <h4>More Information</h4>
        <p>
          For more details about how we use cookies, please read our{' '}
          <Link to="/privacy" className="cookie-link">Privacy Policy</Link> and{' '}
          <Link to="/cookie" className="cookie-link">Cookie Policy</Link>.
        </p>
        <p>
          You can also manage cookies through your browser settings. However, disabling certain cookies may affect the functionality of our website.
        </p>
      </div>
    </div>
  </div>
  )}
       
{/* {activeTab && !['account', 'wishlist', 'orders', 'security', 'addresses', 'payment', 'notifications'].includes(activeTab) && (
  <div className="coming-soon">
    <div className="coming-soon-icon">📋</div>
    <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section</h3>
    <p>This section is coming soon. You can implement specific functionality for {activeTab} here.</p>
  </div>
)} */}

    {!implementedTabs.includes(activeTab) && (
            <div className="coming-soon">
              <div className="coming-soon-icon">📋</div>
              <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section</h3>
              <p>This section is coming soon. You can implement specific functionality for {activeTab} here.</p>
            </div>
          )}
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