import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import SecNav from './SecNav';
import Footer from './Footer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../db/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function CheckOut() {
const navigate = useNavigate();
const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
const [error, setError] = useState(null);
const [userLoading, setUserLoading] = useState(true);
const [toast, setToast] = useState({ show: false, message: '', type: '' });
const showToast = (message, type = 'success') => {
setToast({ show: true, message, type });
setTimeout(() => {
setToast({ show: false, message: '', type: '' });
}, 4000);
};

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUserLoading(false);
      
     
    });
    return () => unsubscribe();
  }, []);

    useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'checkout'));
        const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsList);
      } catch (error) {
        setError(error.message);
      } finally {
        userLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <>
    <Navbar/>
    <SecNav/>
        <h1>Check Out</h1>


   <button>place your order</button>
        <button>cancel</button>
        <button>continue shopping</button>
        <button>go to cart</button>
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
onClick={() => setToast({ show: false, message: '', type: '' })}>
×
</button>
</div>
</div>
)}
</>
)
}
