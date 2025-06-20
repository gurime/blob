import  { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useSearchParams } from "react-router-dom";
import { auth, db } from '../db/firebase';
import { User, Edit3, Save, X, Package, MapPin, CreditCard, Bell, Shield, Heart, Trash2, ShoppingCart, ExternalLink,Settings  } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SecNav from '../components/SecNav';
import { wishlistHandlers } from '../utils/wishlistHandler'; 
import { priceUtils } from '../utils/priceUtils'; 

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
const [searchParams] = useSearchParams();
const defaultTab = searchParams.get("tab") || "account";
const [activeTab, setActiveTab] = useState(defaultTab);  
const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const implementedTabs = ['account', 'wishlist','cookies'];
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
      console.error('Error loading wishlist:', error);
      showToast('Error loading wishlist', 'error');
    } finally {
      setWishlistLoading(false);
    }
  };

  // Remove item from wishlist
  const handleRemoveFromWishlist = async (productId) => {
    if (!auth.currentUser) return;
    
    setRemovingItem(productId);
    try {
      const result = await wishlistHandlers.removeFromWishlist(auth.currentUser.uid, productId);
      if (result.success) {
        setWishlistItems(prev => prev.filter(item => item.productId !== productId));
        showToast('Item removed from wishlist', 'success');
      } else {
        showToast('Error removing item from wishlist', 'error');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      showToast('Error removing item from wishlist', 'error');
    } finally {
      setRemovingItem(null);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const data = userDocSnapshot.data();
            setUserData(data);
            setFormData(data);
          } else {
            // Create default user data if document doesn't exist
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
          
          // Load wishlist when user data is loaded
          await loadWishlist(user.uid);
                  await loadCookieSettings(user.uid);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
      console.error("Error updating user data:", error);
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
    console.error("Error loading cookie settings:", error);
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
    console.error("Error saving cookie settings:", error);
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

          {activeTab === 'wishlist' && (
            <div className="wishlist-section">
              <div className="section-header">
                <h2>My Wishlist</h2>
                <p className="section-subtitle">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
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
                  <p>Start adding items you love to your wishlist!</p>
                  <Link to="/" className="btn btn-primary">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="wishlist-grid">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="wishlist-card">
                      <div className="wishlist-item-image">
                        <img 
                          src={`/assets/images/${item.productData?.imgUrl || item.productImage}`} 
                          alt={item.productName}
                          onError={(e) => {
                            e.target.src = '/assets/images/placeholder.jpg';
                          }}
                        />
                        <button
                          className="remove-wishlist-btn"
                          onClick={() => handleRemoveFromWishlist(item.productId)}
                          disabled={removingItem === item.productId}
                          title="Remove from wishlist"
                        >
                          {removingItem === item.productId ? (
                            <div className="btn-spinner"></div>
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                      
                      <div className="wishlist-item-content">
                        <h3 className="wishlist-item-title">{item.productName}</h3>
                        
                        {item.productData?.category && (
                          <p className="wishlist-item-category">{item.productData.category}</p>
                        )}
                        
                        <div className="wishlist-item-price">
                          <span className="current-price">
                            ${formatPrice(item.productPrice)}
                          </span>
                          {item.productData?.originalPrice && (
                            <span className="original-price">
                              ${formatPrice(item.productData.originalPrice)}
                            </span>
                          )}
                        </div>
                        
                        {item.productData?.description && (
                          <p className="wishlist-item-description">
                            {item.productData.description.length > 100 
                              ? `${item.productData.description.substring(0, 100)}...`
                              : item.productData.description
                            }
                          </p>
                        )}
                        
                        <div className="wishlist-item-meta">
                          <span className="added-date">
                            Added {new Date(item.addedAt).toLocaleDateString()}
                          </span>
                          {item.productData?.prime && (
                            <span className="prime-badge-small">Prime</span>
                          )}
                        </div>
                        
                        <div className="wishlist-item-actions">
                          <button className="btn btn-primary">
                            <ShoppingCart size={14} />
                            Add to Cart
                          </button>
                          <Link 
                            to={`/product/${item.productId}`}
                            className="btn btn-secondary"
                          >
                            <ExternalLink size={14} />
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
              )}
            </div>
          )}



          

       


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