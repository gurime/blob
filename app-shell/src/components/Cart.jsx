import Navbar from './Navbar';
import SecNav from './SecNav';
import Footer from './Footer';
import { useState, useEffect } from 'react';
import { db } from '../db/firebase';
import { doc, getDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../db/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import ClipLoader from 'react-spinners/ClipLoader';
import { Save } from 'lucide-react';

export default function Cart() {
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [cartItems, setCartItems] = useState([]);
const [savedItems, setSavedItems] = useState([]);
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
fetchSavedItems(currentUser.uid);
} else {
setCartItems([]);
setSavedItems([]);
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
setCartItems([]);
setCartSummary({ totalItems: 0, totalValue: 0 });
}
} catch (error) {
setError('Failed to load cart items. Please try again.');
} finally {
setLoading(false);
}
};

// Fetch saved items from Firestore
const fetchSavedItems = async (userId) => {
try {
const savedRef = doc(db, 'savedItems', userId);
const savedDoc = await getDoc(savedRef);
if (savedDoc.exists()) {
const savedData = savedDoc.data();
setSavedItems(savedData.items || []);
} else {
setSavedItems([]);
}
} catch (error) {
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
const newTotalValue = updatedItems.reduce((sum, item) => sum + item.totalPrice,0);

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
showToast('Failed to remove item', 'error');
}
};

// Save item for later
const saveForLater = async (productId) => {
if (!user) return;
try {
// Find the item in cart
const itemToSave = cartItems.find(item => item.productId === productId);
if (!itemToSave) return;
// Remove from cart
const updatedCartItems = cartItems.filter(item => item.productId !== productId);

// Add to saved items (reset quantity to 1)
const savedItem = {
 ...itemToSave,
 quantity: 1,
 totalPrice: itemToSave.price,
 savedAt: new Date().toISOString()
};
            
const updatedSavedItems = [...savedItems, savedItem];
// Update cart in Firestore
if (updatedCartItems.length === 0) {
const cartRef = doc(db, 'carts', user.uid);
await deleteDoc(cartRef);
setCartItems([]);
setCartSummary({ totalItems: 0, totalValue: 0 });
} else {
const newTotalItems = updatedCartItems.reduce((sum, item) => sum + item.quantity, 0);
const newTotalValue = updatedCartItems.reduce((sum, item) => sum + item.totalPrice, 0);

const cartRef = doc(db, 'carts', user.uid);
await updateDoc(cartRef, {
items: updatedCartItems,
totalItems: newTotalItems,
totalValue: newTotalValue,
updatedAt: new Date().toISOString()
});

setCartItems(updatedCartItems);
setCartSummary({
totalItems: newTotalItems,
totalValue: newTotalValue
});
}

// Update saved items in Firestore
const savedRef = doc(db, 'savedItems', user.uid);
await setDoc(savedRef, {
items: updatedSavedItems,
updatedAt: new Date().toISOString()
});
setSavedItems(updatedSavedItems);
showToast('Item saved for later!', 'success');
} catch (error) {
showToast('Failed to save item for later', 'error');
}
};

// Move saved item back to cart
const moveToCart = async (productId) => {
if (!user) return;
try {
// Find the item in saved items
const itemToMove = savedItems.find(item => item.productId === productId);
if (!itemToMove) return;
// Remove from saved items
const updatedSavedItems = savedItems.filter(item => item.productId !== productId);
// Add to cart
const cartItem = {
...itemToMove,
quantity: 1,
totalPrice: itemToMove.price,
addedAt: new Date().toISOString()
};

const updatedCartItems = [...cartItems, cartItem];
const newTotalItems = updatedCartItems.reduce((sum, item) => sum + item.quantity, 0);
const newTotalValue = updatedCartItems.reduce((sum, item) => sum + item.totalPrice, 0);

// Update cart in Firestore
const cartRef = doc(db, 'carts', user.uid);
await setDoc(cartRef, {
items: updatedCartItems,
totalItems: newTotalItems,
totalValue: newTotalValue,
updatedAt: new Date().toISOString()
});

// Update saved items in Firestore
if (updatedSavedItems.length === 0) {
const savedRef = doc(db, 'savedItems', user.uid);
await deleteDoc(savedRef);
setSavedItems([]);
} else {
const savedRef = doc(db, 'savedItems', user.uid);
await updateDoc(savedRef, {
items: updatedSavedItems,
updatedAt: new Date().toISOString()
});
setSavedItems(updatedSavedItems);
}

setCartItems(updatedCartItems);
setCartSummary({
totalItems: newTotalItems,
totalValue: newTotalValue
});

showToast('Item moved to cart!', 'success');
} catch (error) {
showToast('Failed to move item to cart', 'error');
}
};

// Delete saved item
const deleteSavedItem = async (productId) => {
if (!user) return;
try {
const updatedSavedItems = savedItems.filter(item => item.productId !== productId);
if (updatedSavedItems.length === 0) {
const savedRef = doc(db, 'savedItems', user.uid);
await deleteDoc(savedRef);
setSavedItems([]);
} else {
const savedRef = doc(db, 'savedItems', user.uid);
await updateDoc(savedRef, {
items: updatedSavedItems,
updatedAt: new Date().toISOString()
});
setSavedItems(updatedSavedItems);
}

showToast('Item removed from saved items', 'success');
} catch (error) {
showToast('Failed to remove saved item', 'error');
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
<div className="cart-main-container">
<div className="cart-content">
{/* Left Column - Cart Items */}
<div className="cart-left-column">
<div className="cart-header">
<h1>Shopping Cart</h1>
{cartItems.length > 0 && (
<p className="cart-item-count">{cartSummary.totalItems} item(s) in your cart</p>
)}
</div>

{cartItems.length === 0 ? (
<div className="empty-cart">
<div className="empty-cart-icon">🛒</div>
<h2>Your Gulime cart is empty</h2>
<p>Add some amazing products to get started!</p>
<button 
onClick={() => navigate('/')} 
className="continue-shopping-btn"
>
Continue Shopping
</button>
</div>
) : (
<div className="cart-items-container">
{cartItems.map((item) => (
<div key={item.productId} className="cart-item">
<div className="cart-item-image-container">
<img 
src={`/assets/images/${item.imgUrl}`} 
alt={item.productName} 
className="cart-item-image"/>
</div>
                                        
<div className="cart-item-details">
<Link to={`/product/${item.productId}`} >
<h3 className="cart-item-title">
  {item.productName 
    ? `${item.productName} - ${item.model ? ` ${item.model}` : ''}`
    : `${item.storage}GB`
  }
</h3>
</Link>

<p className="cart-item-category">Category: {item.category}</p>
<p className="cart-item-stock">✅ {item.stock}</p>
{(item.premium || item.hasPrime) && (
    <p className="cart-item-shipping">🚚 FREE shipping with Gulime Premium</p>
)}                                            
<div className="cart-item-actions-row">
<div className="quantity-selector">
<label htmlFor={`qty-${item.productId}`}>Qty:</label>
<select 
id={`qty-${item.productId}`}
value={item.quantity}
onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
className="quantity-dropdown">
{[...Array(10)].map((_, i) => (
<option key={i + 1} value={i + 1}>{i + 1}</option>
))}
</select>
</div>
                                                
<button 
onClick={() => removeItem(item.productId)}
className="remove-btn">
Delete
</button>
                                                
<button 
onClick={() => saveForLater(item.productId)}
className="save-later-btn">
<Save size={16} />
Save for later
</button>
</div>
</div>
                                        
<div className="cart-item-price-section">
<span className="cart-item-price">${item.price.toLocaleString(2)}</span>
{item.quantity > 1 && (
<p className="cart-item-subtotal">
Subtotal: ${item.totalPrice.toLocaleString(2)}
</p>
)}
</div>
</div>
))}
                                
<div className="cart-subtotal-bar">
<span className="cart-subtotal-text">
Subtotal ({cartSummary.totalItems} items): 
<strong> ${cartSummary.totalValue.toLocaleString(2)}</strong>
</span>
</div>
</div>
)}

{/* Saved for Later Section */}
<div className="saved-items-section">
<h2>Saved for later ({savedItems.length})</h2>
{savedItems.length === 0 ? (
<div className="saved-items-placeholder">
<p>No items saved for later</p>
</div>
) : (
<div className="saved-items-container">
{savedItems.map((item) => (
<div key={item.productId} className="saved-item">
<div className="saved-item-image-container">
<img 
src={`/assets/images/${item.imgUrl}`} 
alt={item.productName} 
className="saved-item-image"
/>
</div>
                                            
<div className="saved-item-details">
<h4 className="saved-item-title">{item.productName || item.storage}GB</h4>
<p className="saved-item-price">${item.price.toLocaleString(2)}</p>
<p className="saved-item-stock">
{item.stock 
? <span style={{ color: 'green' }}>✅ {item.stock}</span>
: <span style={{ color: 'red' }}>❌ Out Of Stock</span>}
</p>                                                
<div className="saved-item-actions">
<button 
onClick={() => moveToCart(item.productId)}
className="move-to-cart-btn">
Move to cart
</button>

<button 
onClick={() => deleteSavedItem(item.productId)}
className="delete-saved-btn">
Delete
</button>
</div>
</div>
</div>
))}
</div>
)}
</div>
</div>

{/* Right Column - Checkout Summary */}
{cartItems.length > 0 && (
<div className="cart-right-column">
<div className="checkout-summary">
{cartItems.some(item => item.premium === "Gulime Premium" || item.hasPrime) && (
<div className="prime-offer">
<div className="prime-logo">Gulime Premium</div>
<p>FREE One-Day Delivery available</p>
</div>
)}

                                
<div className="summary-details">

<div className="summary-row">
<span>Subtotal ({cartSummary.totalItems} items):</span>
<span className="summary-price">${cartSummary.totalValue.toLocaleString(2)}</span>
</div>

<div className="summary-row">
<span>Shipping:</span>
{cartItems.some(item => item.premium === "Gulime Premium" || item.hasPrime) && (
<span className="summary-price">FREE</span>
)}
</div>

<div className="summary-row">
<span>Seller:</span>
<span className="summary-price">           
{cartItems.map(item => item.seller)}
</span>
</div>

<div className="summary-row total-row">
<span>Total:</span>
<span className="summary-total">${cartSummary.totalValue.toLocaleString(2)}</span>
</div>
</div>
                                
<button
showToast={showToast}
className="checkout-btn">
    Checkout
</button>
            
                                
<button 
onClick={() => navigate('/')}
className="continue-shopping-link">
Continue shopping
</button>
</div>
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
onClick={() => setToast({ show: false, message: '', type: '' })}>
×
</button>
</div>
</div>
)}
</>
);
}