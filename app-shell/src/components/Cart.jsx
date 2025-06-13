import Navbar from './Navbar';
import SecNav from './SecNav';
import Footer from './Footer';
import { useState, useEffect } from 'react';
import { db } from '../db/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth } from '../db/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import ClipLoader from 'react-spinners/ClipLoader';

export default function Cart() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [cartSummary, setCartSummary] = useState({
        totalItems: 0,
        totalValue: 0
    });
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 4000);
    };

    // Monitor authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setUserLoading(false);
            
            if (currentUser) {
                fetchUserCart(currentUser.uid);
            } else {
                setCartItems([]);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // Fetch user's cart from Firestore
    const fetchUserCart = async (userId) => {
        try {
            setLoading(true);
            setError(null);
            
            const cartRef = doc(db, 'carts', userId);
            const cartDoc = await getDoc(cartRef);
            
            if (cartDoc.exists()) {
                const cartData = cartDoc.data();
                setCartItems(cartData.items || []);
                setCartSummary({
                    totalItems: cartData.totalItems || 0,
                    totalValue: cartData.totalValue || 0
                });
            } else {
                // No cart exists for this user
                setCartItems([]);
                setCartSummary({ totalItems: 0, totalValue: 0 });
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            setError('Failed to load cart items. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Update item quantity
    const updateQuantity = async (productId, newQuantity) => {
        if (!user || newQuantity < 1) return;

        try {
            const updatedItems = cartItems.map(item => {
                if (item.productId === productId) {
                    return {
                        ...item,
                        quantity: newQuantity,
                        totalPrice: item.price * newQuantity
                    };
                }
                return item;
            });

            const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const newTotalValue = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

            // Update Firestore
            const cartRef = doc(db, 'carts', user.uid);
            await updateDoc(cartRef, {
                items: updatedItems,
                totalItems: newTotalItems,
                totalValue: newTotalValue,
                updatedAt: new Date().toISOString()
            });

            // Update local state
            setCartItems(updatedItems);
            setCartSummary({
                totalItems: newTotalItems,
                totalValue: newTotalValue
            });

            showToast('Cart updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating quantity:', error);
            showToast('Failed to update item quantity', 'error');
        }
    };

    // Remove item from cart
    const removeItem = async (productId) => {
        if (!user) return;

        try {
            const updatedItems = cartItems.filter(item => item.productId !== productId);
            
            if (updatedItems.length === 0) {
                // If cart is empty, delete the document
                const cartRef = doc(db, 'carts', user.uid);
                await deleteDoc(cartRef);
                setCartItems([]);
                setCartSummary({ totalItems: 0, totalValue: 0 });
            } else {
                const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
                const newTotalValue = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

                // Update Firestore
                const cartRef = doc(db, 'carts', user.uid);
                await updateDoc(cartRef, {
                    items: updatedItems,
                    totalItems: newTotalItems,
                    totalValue: newTotalValue,
                    updatedAt: new Date().toISOString()
                });

                // Update local state
                setCartItems(updatedItems);
                setCartSummary({
                    totalItems: newTotalItems,
                    totalValue: newTotalValue
                });
            }

            showToast('Item removed from cart', 'success');
        } catch (error) {
            console.error('Error removing item:', error);
            showToast('Failed to remove item', 'error');
        }
    };

    // Loading state
    if (loading || userLoading) {
        return (
            <>
                <Navbar />
                <SecNav />
                <div className="loading-container">
                    <ClipLoader color="#FF9900" size={50} />
                    <p>Loading your cart...</p>
                </div>
                <Footer />
            </>
        );
    }

    // Not logged in
    if (!user) {
        return (
            <>
                <Navbar />
                <SecNav />
                <div className="cart-container">
                    <h1>Shopping Cart</h1>
                    <p>Please log in to view your cart items.</p>
                    <button onClick={() => navigate('/login')} className="login-button">
                        Log In
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    // Error state
    if (error) {
        return (
            <>
                <Navbar />
                <SecNav />
                <div className="cart-container">
                    <h1>Shopping Cart</h1>
                    <p className="error-message">{error}</p>
                    <button onClick={() => fetchUserCart(user.uid)} className="retry-button">
                        Try Again
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <SecNav />
            <div className="cart-header">
                <h1>Shopping Cart</h1>
                <p>Manage your items below</p>
            </div>
            
            <div className="cart-container">
                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <h2>Your cart is empty</h2>
                        <p>Add some items to get started!</p>
                        <button 
                            onClick={() => navigate('/')} 
                            className="continue-shopping-button"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="cart-summary">
                            <h2>Cart Summary</h2>
                            <p>Items: {cartSummary.totalItems}</p>
                            <p>Total: ${cartSummary.totalValue.toFixed(2)}</p>
                        </div>

                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <div key={item.productId} className="cart-item">
                                    <img 
                                        src={`/assets/images/${item.imgUrl}`} 
                                        alt={item.productName} 
                                        className="cart-item-image"
                                    />
                                    <div className="cart-item-details">
                                        <h3>{item.productName}</h3>
                                        <p className="cart-item-category">{item.category}</p>
                                        <p className="cart-item-price">Price: ${item.price.toFixed(2)}</p>
                                        
                                        <div className="quantity-controls">
                                            <button 
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="quantity-btn"
                                            >
                                                -
                                            </button>
                                            <span className="quantity-display">Quantity: {item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                className="quantity-btn"
                                            >
                                                +
                                            </button>
                                        </div>
                                        
                                        <p className="cart-item-total">Total: ${item.totalPrice.toFixed(2)}</p>
                                        
                                        <button 
                                            onClick={() => removeItem(item.productId)}
                                            className="remove-button"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-actions">
                            <button className="checkout-button">
                                Proceed to Checkout (${cartSummary.totalValue.toFixed(2)})
                            </button>
                            <button 
                                onClick={() => navigate('/')}
                                className="continue-shopping-button"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="saved-items-section">
                <h2>Saved Items</h2>
                <p>Items you saved for later will appear here.</p>
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