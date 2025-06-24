/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../db/firebase';
import Footer from './Footer';
import Navbar from './Navbar';
import SecNav from './SecNav';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51RcYY24hnBPz0qYataEaCAgiTCoImteQhfmUtRoWgZFyO5v2pbyqqI141fLWWvd3qlnYllSsXBQoe6Ie826XjeI4008pK65JLH');

export default function Order() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('standard');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [cardElement, setCardElement] = useState(null);
  const [cardErrors, setCardErrors] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(id);
  const [names, setNames] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [stripeLoaded, setStripeLoaded] = useState(false);
const [userInfo, setUserInfo] = useState({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: ''
});
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const fullName = `${userData.fname || ''} ${userData.lname || ''}`.trim();
            setNames(fullName || userData.email || 'User');
          } else {
            setNames('User');
          }
          setIsSignedIn(true);
        } catch (error) {
          setIsSignedIn(true);
          setNames('User');
        }
      } else {
        setIsSignedIn(false);
        setNames('');
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Add this useEffect to populate user info when authentication state changes
useEffect(() => {
  if (isSignedIn && auth.currentUser) {
    const getUserInfo = async () => {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserInfo(prev => ({
            firstName: userData.fname || prev.firstName,
            lastName: userData.lname || prev.lastName,
            email: userData.email || auth.currentUser.email || prev.email,
            phone: userData.phone || prev.phone,
            address: userData.address || prev.address,
            city: userData.city || prev.city,
            state: userData.state || prev.state,
            zip: userData.zip || prev.zip
          }));
        } else {
          setUserInfo(prev => ({
            ...prev,
            email: auth.currentUser.email || prev.email
          }));
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    getUserInfo();
  }
}, [isSignedIn]);

const handleUserInfoChange = (e) => {
  const { name, value } = e.target;
  setUserInfo(prev => ({
    ...prev,
    [name]: value
  }));
};


  useEffect(() => {
    if (location.state?.orderData) {
      setOrderData(location.state.orderData);
      setIsLoading(false);
    } else if (location.state?.orderId) {
      fetchOrderFromFirebase(location.state.orderId);
    } else if (id && id !== 'temp') {
      fetchOrderFromFirebase(id);
    } else if (id === 'temp') {
      const storedOrder = localStorage.getItem('tempOrderData');
      if (storedOrder) {
        setOrderData(JSON.parse(storedOrder));
        setIsLoading(false);
      } else {
        navigate('/cart');
      }
    } else {
      navigate('/cart');
    }
  }, [location.state, navigate, id]);

  const fetchOrderFromFirebase = async (orderId) => {
    try {
      setIsLoading(true);
      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await getDoc(orderRef);
      if (orderDoc.exists()) {
        const orderData = { id: orderDoc.id, ...orderDoc.data() };
        setOrderData(orderData);
      } else {
        showToast('Order not found', 'error');
        navigate('/cart');
      }
    } catch (error) {
      showToast('Failed to load order', 'error');
      navigate('/cart');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await stripePromise;
        if (!stripeInstance) {
          console.error('Failed to load Stripe');
          return;
        }
        
        setStripe(stripeInstance);

        // Create elements instance with custom styling
        const elementsInstance = stripeInstance.elements({
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#0570de',
              colorBackground: '#ffffff',
              colorText: '#30313d',
              colorDanger: '#df1b41',
              fontFamily: 'Ideal Sans, system-ui, sans-serif',
              spacingUnit: '4px',
              borderRadius: '8px',
            },
            rules: {
              '.Input': {
                border: '1px solid #e0e6ed',
                padding: '12px 16px',
                fontSize: '16px',
                backgroundColor: '#ffffff',
              },
              '.Input:focus': {
                border: '2px solid #0570de',
                boxShadow: '0 0 0 1px #0570de',
              },
              '.Label': {
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                marginBottom: '8px',
              }
            }
          }
        });
        setElements(elementsInstance);

        // Wait a bit for the DOM element to be available
        setTimeout(() => {
          const cardElementContainer = document.getElementById('card-element');
          if (cardElementContainer && !cardElementContainer.hasChildNodes()) {
            // Create card element
            const card = elementsInstance.create('card', {
              style: {
                base: {
                  fontSize: '16px',
                  color: '#000000',
                  fontFamily: 'Ideal Sans, system-ui, sans-serif',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
              hidePostalCode: false,
            });

            card.mount('#card-element');
            setCardElement(card);
            setStripeLoaded(true);

            // Listen for real-time validation errors
            card.on('change', ({ error }) => {
              setCardErrors(error ? error.message : null);
            });

            // Listen for focus events
            card.on('focus', () => {
              setCardErrors(null);
            });
          }
        }, 100);

      } catch (error) {
        console.error('Error initializing Stripe:', error);
        showToast('Failed to load payment system', 'error');
      }
    };

    // Only initialize Stripe after the component has mounted and orderData is available
    if (orderData && !stripeLoaded) {
      initializeStripe();
    }
  }, [orderData, stripeLoaded]);

// Payment submission handler
const handleSubmit = async (event) => {
  event.preventDefault();
  
  if (!stripe || !elements || !cardElement) {
    showToast('Payment system not ready. Please try again.', 'error');
    return;
  }

  if (!orderData) {
    showToast('Order data not available', 'error');
    return;
  }

  // Validate required fields
  const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zip'];
  const missingFields = requiredFields.filter(field => !userInfo[field].trim());
  
  if (missingFields.length > 0) {
    showToast(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
    return;
  }

  setLoading(true);
  setCardErrors(null);

  try {
    // First, create a payment method to validate the card
    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        email: userInfo.email,
        phone: userInfo.phone,
        address: {
          line1: userInfo.address,
          city: userInfo.city,
          state: userInfo.state,
          postal_code: userInfo.zip,
          country: 'US',
        },
      },
    });

    if (paymentMethodError) {
      setCardErrors(paymentMethodError.message);
      showToast(paymentMethodError.message, 'error');
      setLoading(false);
      return;
    }

    // Calculate total including delivery fee
    const totalAmount = Math.round((orderData.summary.totalValue + deliveryFee) * 100);
    
    // FIXED: Correct API endpoint URL
    let clientSecret;
    try {
      const response = await fetch('http://localhost:3000/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'usd',
          orderData: {
            ...orderData,
            deliveryOption: selectedDeliveryOption,
            deliveryFee: deliveryFee,
            userInfo: userInfo // Include user info in order data
          },
          deliveryOption: selectedDeliveryOption,
          deliveryFee: deliveryFee,
          zip: userInfo.zip,
          state: userInfo.state,
          city: userInfo.city,
          address: userInfo.address,
          payment_method: paymentMethod.id,
          customer_name: `${userInfo.firstName} ${userInfo.lastName}`,
          customer_email: userInfo.email,
          customer_phone: userInfo.phone,
          customer_id: auth.currentUser?.uid || '',
          order_id: orderData.id || '',
          total_items: orderData.summary?.totalItems || orderData.items?.length || 0,
          description: `Order #${orderData.id} - ${orderData.summary?.totalItems || orderData.items?.length || 0} items`,
          receipt_email: userInfo.email,
          metadata: {
            orderId: orderData.id || '',
            deliveryOption: selectedDeliveryOption,
            deliveryFee: deliveryFee.toString(),
            totalItems: (orderData.summary?.totalItems || orderData.items?.length || 0).toString(),
            customerName: `${userInfo.firstName} ${userInfo.lastName}`,
            customerEmail: userInfo.email,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.client_secret) {
        throw new Error('No client secret returned from server');
      }
      
      clientSecret = data.client_secret;
      
    } catch (apiError) {
      console.warn('Payment API error:', apiError);
      
      // Check if it's a network error or server is down
      if (apiError.message.includes('Failed to fetch') || 
          apiError.message.includes('NetworkError') ||
          apiError.message.includes('HTTP 404') ||
          apiError.message.includes('HTTP 500')) {
        
        // Mock payment for development/testing when API is not available
        console.log('Using mock payment flow');
        showToast('Payment processed successfully! (Development mode)', 'success');
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Clear cart/products after successful mock payment
        await clearCart();
        
        navigate('/PaymentSuccess', { 
          state: { 
            mockPayment: true,
            orderData: {
              ...orderData,
              deliveryOption: selectedDeliveryOption,
              deliveryFee: deliveryFee,
              userInfo: userInfo
            },
            amount: totalAmount / 100,
            paymentMethod: paymentMethod
          }
        });
        return;
      } else {
        // Re-throw other errors
        throw apiError;
      }
    }

    // Confirm payment with the client secret
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id
    });

    if (error) {
      setCardErrors(error.message);
      showToast(error.message, 'error');
    } else if (paymentIntent.status === 'succeeded') {
      showToast('Payment successful!', 'success');
      
      // Clear cart/products after successful payment
      await clearCart();
      
      navigate('/PaymentSuccess', { 
        state: { 
          paymentIntent: paymentIntent,
          orderData: {
            ...orderData,
            deliveryOption: selectedDeliveryOption,
            deliveryFee: deliveryFee,
            userInfo: userInfo
          }
        }
      });
    } else {
      setCardErrors('Payment was not completed successfully');
      showToast('Payment was not completed successfully', 'error');
    }
    
  } catch (error) {
    console.error('Payment error:', error);
    const errorMessage = error.message || 'Payment failed. Please try again.';
    setCardErrors(errorMessage);
    showToast(errorMessage, 'error');
  } finally {
    setLoading(false);
  }
};

// Add this helper function to clear the cart
const clearCart = async () => {
  try {
    if (auth.currentUser) {
      // If using Firebase/Firestore for cart storage
      const cartRef = doc(db, 'carts', auth.currentUser.uid);
      await deleteDoc(cartRef);
      

    }
    
    // If using local storage
    localStorage.removeItem('cart');
    localStorage.removeItem('cartItems');
    
 
    
  } catch (error) {
    // Don't throw error here as payment was successful
  }
};


  const handleDeliveryChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedDeliveryOption(selectedOption);
    
    // Set delivery fees based on selection
    let fee = 0;
    switch(selectedOption) {
      case 'same-day':
        fee = 9.99;
        break;
      case 'one-day':
      case 'two-day':
      case 'standard':
      default:
        fee = 0;
        break;
    }
    setDeliveryFee(fee);
  };

  const handleCancelOrder = () => {
    navigate('/cart');
  };

  // Calculate total including delivery fee
  const calculateTotal = () => {
    return orderData.summary.totalValue + deliveryFee;
  };

  if (isLoading || !orderData) {
    return (
      <>
        <Navbar />
        <SecNav />
        <div className="order-container">
          <div className="order-content">
            <div className="loading-state">
              <h2>Loading your order...</h2>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
<>
<Navbar />
<SecNav />
<div className="order-container">
<div className="order-content">
{/* Main Order Section */}
<div className="order-main">
<div className="order-header">
<h1>Review Your Order</h1>
<p className="order-id">Order#: {orderData.id}</p>
</div>
            
<div className="order-items-section">
<h2> Items <span className="items-count">({orderData.summary.totalItems})</span></h2>
              
{orderData.items.map((item, index) => (
<div key={item.productId || index} className="order-item">
<div className="order-item-image">
<img
src={`/assets/images/${item.imgUrl}`}
alt={item.productName}
onError={(e) => {e.target.src = '/assets/images/placeholder.jpg';}}/>
</div>
                  
<div className="order-item-details">
{item.productName && (
<h3>{item.productName} {/\d+$/.test(item.productName) ? 'GB' : ''}</h3>
)} 

{item.brand && (
<p><span className="detail-label">Brand:</span> {item.brand}</p>
)}

{item.model && (
<p><span className="detail-label">Model:</span> {item.model}</p>
)}

{item.price && (
<p><span className="detail-label">Price:</span> ${Number(item.price).toLocaleString()}</p>
)}

{item.seller && (
<p><span className="detail-label">Seller:</span> {item.seller}</p>
)}

{item.condition && (
<p><span className="detail-label">Condition:</span> {item.condition}</p>
)}

{item.category && (
<p><span className="detail-label">Category:</span> {item.category}</p>
)}

{item.quantity && (
<p><span className="detail-label">Quantity:</span> {item.quantity}</p>
)}

{item.automotiveConfig && (
<div className="automotive-config">
<p><strong>Configuration:</strong></p>
<ul>
<li>Color: {item.automotiveConfig.configurationSummary.colorName}</li>
<li>Wheels: {item.automotiveConfig.configurationSummary.wheelsName}</li>
<li>Interior: {item.automotiveConfig.configurationSummary.interiorName}</li>
<li>Autopilot: {item.automotiveConfig.configurationSummary.autopilotName}</li>
{item.automotiveConfig.configurationSummary.extrasNames !== 'None' && (
<li>Extras: {item.automotiveConfig.configurationSummary.extrasNames}</li>
)}
</ul>
</div>
)}
</div>
</div>
))}
</div>
</div>

{/* Order Summary Sidebar */}
<div className="order-summary">
<h2>Order Summary</h2>
            
<div className="summary-row">
<span>Subtotal ({orderData.summary.totalItems} items):</span>
<span>${orderData.summary.totalValue.toLocaleString()}</span>
</div>
            
<div className="summary-row">
<span>Shipping:</span>
{orderData.items.some(item => item.hasPrime) ? (
<div className="prime-shipping">
<div className="prime-badge">
<img
className="prime-logo"
src={`/assets/images/${orderData.items.find(item => item.hasPrime)?.hasPrime}`}
alt="Gulime Premium"/>
</div>
</div>
) : (
<span>3-5 Day Shipping</span>
)}
</div>

{/* Fixed delivery selector */}
{orderData.items.some(item => item.hasPrime) ? (
<div className="summary-row">
<span>Estimated Delivery:</span>
<select 
className="delivery-select"
value={selectedDeliveryOption}
onChange={handleDeliveryChange}>
<option value="same-day">Same-Day Delivery (+$9.99)</option>
<option value="one-day">FREE One-Day</option>
<option value="two-day">FREE Two-Day</option>
<option value="standard">Standard Delivery</option>
</select>
</div>
) : (
<div className="summary-row">
<span>Estimated Delivery:</span>
<select 
className="delivery-select"
value={selectedDeliveryOption}
onChange={handleDeliveryChange}>
<option value="standard">Standard (3-5 Business Days)</option>
<option value="same-day">Same-Day Delivery (+$9.99)</option>
</select>
</div>
)}

<div className="summary-row">
<span>Delivery Fee:</span>
<span>${deliveryFee > 0 ? deliveryFee.toFixed(2) : 'FREE'}</span>
</div>

{/* Updated total calculation */}
<div className="summary-row total-row">
<span><strong>Total:</strong></span>
<span><strong>${calculateTotal().toLocaleString()}</strong></span>
</div>
            
<div className="order-actions">
  <form onSubmit={handleSubmit} className="payment-form">
    {/* User Information Section */}
    <div className="user-info-section">
      <h3>Shipping Information</h3>
      
<div className="form-row">
<div className="form-group">
<label htmlFor="firstName" className="form-label">
First Name *
</label>
<input
type="text"
id="firstName"
name="firstName"
value={userInfo.firstName}
onChange={handleUserInfoChange}
className="form-input"
required/>
</div>
        
<div className="form-group">
<label htmlFor="lastName" className="form-label">
Last Name *
</label>
<input
type="text"
id="lastName"
name="lastName"
value={userInfo.lastName}
onChange={handleUserInfoChange}
className="form-input"
required/>
</div>
</div>

<div className="form-row">
<div className="form-group">
<label htmlFor="email" className="form-label">
Email Address *
</label>
<input
type="email"
id="email"
name="email"
value={userInfo.email}
onChange={handleUserInfoChange}
className="form-input"
required/>
</div>
        
<div className="form-group">
<label htmlFor="phone" className="form-label">
Phone Number
</label>
<input
type="tel"
id="phone"
name="phone"
value={userInfo.phone}
onChange={handleUserInfoChange}
className="form-input"
placeholder="(555) 123-4567"/>
</div>
</div>

<div className="form-group">
<label htmlFor="address" className="form-label">
Street Address *
</label>
<input
type="text"
id="address"
name="address"
value={userInfo.address}
onChange={handleUserInfoChange}
className="form-input"
required/>
</div>

<div className="form-row">
<div className="form-group">
<label htmlFor="city" className="form-label">
City *
</label>
<input
type="text"
id="city"
name="city"
value={userInfo.city}
onChange={handleUserInfoChange}
className="form-input"
required/>
</div>
        
<div className="form-group">
<label htmlFor="state" className="form-label">
State *
</label>
<input
type="text"
id="state"
name="state"
value={userInfo.state}
onChange={handleUserInfoChange}
className="form-input"
placeholder="CA"
maxLength="2"
required/>
</div>
        
<div className="form-group">
<label htmlFor="zip" className="form-label">
ZIP Code *
</label>
<input
type="text"
id="zip"
name="zip"
value={userInfo.zip}
onChange={handleUserInfoChange}
className="form-input"
placeholder="12345"
maxLength="10"
required/>
</div>
</div>
</div>

{/* Payment Information Section */}
<div className="payment-section">
<h3>Payment Information</h3>
      
<div className="card-element-container">
<label htmlFor="card-element" className="card-label">
Credit or Debit Card *
</label>
<div id="card-element" className="card-input">
{/* Stripe Elements will mount here */}
</div>

{cardErrors && (
<div className="card-errors" role="alert">
{cardErrors}
</div>
)}
</div>
</div>

<button 
type='submit'                
className="proceed-payment-btn" 
disabled={loading || !isSignedIn || !orderData || !stripe || !elements || !stripeLoaded}>
{loading ? 'Processing...' : `Place Your Order - $${calculateTotal().toLocaleString()}`}
</button>
</form>
  
<button 
onClick={handleCancelOrder} 
className="cancel-order-btn" 
disabled={loading}>
Cancel Order
</button>
</div>
</div>
</div>
</div>
      
<Footer />

{toast.show && (
<div className={`toast ${toast.type}`}>
<div className="toast-content">
<span className="toast-icon">
{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
</span>
<span className="toast-message">{toast.message}</span>
<button
className="toast-close"
onClick={() => setToast({ show: false, message: '', type: '' })}>×
</button>
</div>
</div>
)}
</>
);
}