import { doc, getDoc } from 'firebase/firestore';
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
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);

      // Create elements instance with custom styling
      const elementsInstance = stripeInstance.elements({
        appearance: {
          theme: 'stripe', // or 'night', 'flat'
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

      // Create card element
      const card = elementsInstance.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
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

      // Listen for real-time validation errors
      card.on('change', ({ error }) => {
        setCardErrors(error ? error.message : null);
      });
    };

    initializeStripe();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !cardElement) {
      return;
    }

    setLoading(true);

    try {
      // Create payment intent on your backend
      const totalAmount = Math.round((orderData.summary.totalValue + deliveryFee) * 100);
      
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'usd',
          orderData: orderData,
          deliveryOption: selectedDeliveryOption,
          deliveryFee: deliveryFee,
        }),
      });

      const { client_secret } = await response.json();

      // Confirm payment with card element
      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer Name', // You can get this from your user data
          },
        }
      });

      if (error) {
        setCardErrors(error.message);
        onError?.(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess?.(paymentIntent);
      }
    } catch (error) {
      setCardErrors('Payment failed. Please try again.');
      onError?.(error.message);
    } finally {
      setLoading(false);
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

   const handleProceedToPayment = async () => {
    try {
      setLoading(true);
      
      // Calculate total including delivery fee
      const totalAmount = Math.round((orderData.summary.totalValue + deliveryFee) * 100); // Convert to cents
      
      // Create checkout session on your backend
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'usd',
          orderData: orderData,
          deliveryOption: selectedDeliveryOption,
          deliveryFee: deliveryFee,
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/order/${orderData.id}`,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }
      
      const { sessionId } = await response.json();
      
      // Get Stripe instance
      const stripe = await stripePromise;
      
      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });
      
      if (error) {
        showToast(error.message, 'error');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      showToast('Payment failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
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
          <div className="custom-payment-form">
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="payment-section">
          <h3>Payment Information</h3>
          
          <div className="card-element-container">
            <label htmlFor="card-element" className="card-label">
              Credit or Debit Card
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

        <div className="payment-summary">
          <div className="summary-line">
            <span>Subtotal:</span>
            <span>${orderData.summary.totalValue.toLocaleString()}</span>
          </div>
          <div className="summary-line">
            <span>Delivery Fee:</span>
            <span>${deliveryFee > 0 ? deliveryFee.toFixed(2) : 'FREE'}</span>
          </div>
          <div className="summary-line total-line">
            <span><strong>Total:</strong></span>
            <span><strong>${calculateTotal().toLocaleString()}</strong></span>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={!stripe || loading} 
          className="pay-button"
        >
          {loading ? 'Processing...' : `Pay $${calculateTotal().toLocaleString()}`}
        </button>
      </form>
      </div>
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
                      onError={(e) => {e.target.src = '/assets/images/placeholder.jpg';}}
                    />
                  </div>
                  
                  <div className="order-item-details">
                    <h3>{item.productName} {/\d+$/.test(item.productName) ? 'GB' : ''}</h3>
                    
                    {item.brand && (
                      <p><span className="detail-label">Brand:</span> {item.brand}</p>
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
                      alt="Prime"
                    />
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
                  onChange={handleDeliveryChange}
                >
                  <option value="one-day">FREE One-Day</option>
                  <option value="two-day">FREE Two-Day</option>
                  <option value="same-day">Same-Day Delivery (+$9.99)</option>
                  <option value="standard">Standard Delivery</option>
                </select>
              </div>
            ) : (
              <div className="summary-row">
                <span>Estimated Delivery:</span>
                <select 
                  className="delivery-select"
                  value={selectedDeliveryOption}
                  onChange={handleDeliveryChange}
                >
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
              <button 
                onClick={handleProceedToPayment} 
                className="proceed-payment-btn" 
                disabled={loading}
              >
                {loading ? 'Processing...' : `Proceed to Payment - $${calculateTotal().toLocaleString()}`}
              </button>
              
              <button 
                onClick={handleCancelOrder} 
                className="cancel-order-btn" 
                disabled={loading}
              >
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