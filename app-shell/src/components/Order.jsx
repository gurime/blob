import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../db/firebase';
import Footer from './Footer';
import Navbar from './Navbar';
import SecNav from './SecNav';

export default function Order() {
const {id} = useParams();
const navigate = useNavigate();
const [orderData, setOrderData] = useState(null);
const [isLoading, setIsLoading] = useState(true);
const [isSignedIn, setIsSignedIn] = useState(false);
const [names, setNames] = useState('');
const [toast, setToast] = useState({ show: false, message: '', type: '' });
const showToast = (message, type = 'success') => {
setToast({ show: true, message, type });
setTimeout(() => {
setToast({ show: false, message: '', type: '' });
}, 4000);
};
// Check if the user is signed in and fetch user data
useEffect(() => {
const unsubscribe = auth.onAuthStateChanged(async (user) => {
if (user) {
try {
const userDocRef = doc(db, "users", user.uid);
const userDocSnapshot = await getDoc(userDocRef);
if (userDocSnapshot.exists()) {
const userData = userDocSnapshot.data();
// Get the full name from fname and lname
const fullName = `${userData.fname || ''} `.trim();
setNames(fullName || userData.email || 'User');
} else {
setNames('User');
}
setIsSignedIn(true);
} catch (error) {
setIsSignedIn(true); // Still signed in even if we can't fetch user data
setNames('User');
}
} else {
setIsSignedIn(false);
setNames('');
}
});
return () => unsubscribe();
}, []);
return (
<>
<Navbar/>
<SecNav/>
Order
<Footer/>
{toast.show && (
<div className={`toast ${toast.type}`}>
<div className="toast-content">
<span className="toast-icon">
{toast.type === 'success' ? '✓' : '✕'}
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
)
}
