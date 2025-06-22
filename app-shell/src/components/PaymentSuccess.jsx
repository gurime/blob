import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../db/firebase';
import { doc, updateDoc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import Footer from './Footer';
import Navbar from './Navbar';
import SecNav from './SecNav';

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [names, setNames] = useState('');

  const [orderSaved, setOrderSaved] = useState(false);
  const [error, setError] = useState(null);

  // Get payment data from navigation state
  const { paymentIntent, orderData, mockPayment, amount, paymentMethod } = location.state || {};

  useEffect(() => {
    if (!orderData) {
      // No order data, redirect to cart
      navigate('/cart');
      return;
    }

    // Save successful order to Firebase
    saveOrderToFirebase();
  }, [orderData, navigate]);

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
  if (!orderData || isLoading) return;

  if (!isSignedIn) {
    // Show login error or redirect
    setError('You must be signed in to complete the purchase.');
    return;
  }

  // Save the order now that user is confirmed
  saveOrderToFirebase();
}, [orderData, isSignedIn, isLoading]);


  const saveOrderToFirebase = async () => {
    if (!orderData) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create order record with payment information
      const orderRecord = {
        ...orderData,
        userId: user.uid,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: mockPayment ? 'mock' : 'stripe',
        paymentId: mockPayment ? `mock_${Date.now()}` : paymentIntent?.id,
        paidAmount: mockPayment ? amount : (paymentIntent?.amount / 100),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Add payment details
        paymentDetails: {
          isMock: mockPayment || false,
          paymentIntentId: paymentIntent?.id || null,
          paymentMethodId: paymentMethod?.id || null,
            cardLast4: paymentMethod?.card?.last4 || 'XXXX',
  cardBrand: paymentMethod?.card?.brand || 'unknown',
            amount: mockPayment ? amount : (paymentIntent?.amount / 100) || 0,
            currency: paymentIntent?.currency || 'usd',
            customerEmail: user.email || '',
        },
        customer: {
          uid: user.uid,
          email: user.email || '',
          name: names || 'Guest User',
          phone: orderData.customer?.phone || '',
          address: orderData.customer?.address || {},
        },
        deliveryOption: orderData.deliveryOption || 'standard',
        deliveryFee: orderData.deliveryFee || 0,
        summary: {
          totalItems: orderData.summary?.totalItems || orderData.items.length,
          totalPrice: orderData.summary?.totalPrice || orderData.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0),
          totalDiscount: orderData.summary?.totalDiscount || 0,
          totalTax: orderData.summary?.totalTax || 0,
          grandTotal: orderData.summary?.grandTotal || (orderData.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0) + (orderData.deliveryFee || 0)),
        },
        items: orderData.items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          imgUrl: item.imgUrl,              
            price: item.price,
            quantity: item.quantity || 1,
            category: item.category || 'general',
        })),
        
      };

      // Save order to Firebase
      const orderRef = doc(db, 'orders', orderData.id || `order_${Date.now()}`);
      await setDoc(orderRef, orderRecord);

      // Clear any temporary order data
      localStorage.removeItem('tempOrderData');
      
      setOrderSaved(true);
      setIsLoading(false);

    } catch (error) {
      console.error('Error saving order:', error);
      setError('Failed to save order details');
      setIsLoading(false);
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <SecNav />
        <div className="payment-success-container">
          <div className="loading-state">
            <h2>Processing your order...</h2>
            <div className="spinner"></div>
          </div>
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
        <div className="payment-success-container">
          <div className="error-state">
            <h2>Order Processing Error</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/cart')} className="btn-primary">
              Return to Cart
            </button>
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
      
      <div className="payment-success-container">
        <div className="success-content">
          <div className="success-header">
            <div className="success-icon">✅</div>
            <h1>Payment Successful!</h1>
            <p className="success-subtitle">
              Thank you for your order. We've received your payment and will process your order shortly.
            </p>
          </div>

          <div className="order-confirmation">
            <h2>Order Confirmation</h2>
            <div className="confirmation-details">
              <div className="detail-row">
                <span className="label">Order Number:</span>
                <span className="value">{orderData?.id || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Payment ID:</span>
                <span className="value">
                  {mockPayment ? 'MOCK_PAYMENT' : (paymentIntent?.id || 'N/A')}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Amount Paid:</span>
                <span className="value">
                  ${mockPayment ? amount?.toFixed(2) : ((paymentIntent?.amount / 100)?.toFixed(2) || '0.00')}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Payment Method:</span>
                <span className="value">
                  {mockPayment ? 'Development Mode' : 
                   `****${paymentIntent?.payment_method?.card?.last4 || paymentMethod?.card?.last4 || 'XXXX'}`}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className="value success-status">Confirmed</span>
              </div>
            </div>
          </div>

          {orderData?.items && (
            <div className="order-summary">
              <h3>Order Items ({orderData.summary?.totalItems || orderData.items.length})</h3>
              <div className="items-list">
                {orderData.items.map((item, index) => (
                  <div key={item.productId || index} className="success-item">
                    <div className="item-image">
                      <img
                        src={`/assets/images/${item.imgUrl}`}
                        alt={item.productName}
                        onError={(e) => {e.target.src = '/assets/images/placeholder.jpg';}}
                      />
                    </div>
                    <div className="item-details">
                      <h4>{item.productName}</h4>
                      {item.quantity && <p>Quantity: {item.quantity}</p>}
                      {item.price && <p>Price: ${item.price}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="next-steps">
            <h3>What's Next?</h3>
            <ul>
              <li>📧 You'll receive an order confirmation email shortly</li>
              <li>📦 We'll send you tracking information when your order ships</li>
              <li>🚚 Estimated delivery: 3-5 business days</li>
            </ul>
          </div>

          {mockPayment && (
            <div className="dev-notice">
              <p><strong>Development Notice:</strong> This was a mock payment since the payment API is not available. In production, this would be a real transaction.</p>
            </div>
          )}

          <div className="action-buttons">
            <button onClick={handleContinueShopping} className="btn-secondary">
              Continue Shopping
            </button>
            <button onClick={handleViewOrders} className="btn-primary">
              View My Orders
            </button>
          </div>
        </div>
      </div>

      <Footer />

  
    </>
  );
}