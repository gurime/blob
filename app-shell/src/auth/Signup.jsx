import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { db } from "../db/firebase";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../db/firebase';
import { doc, setDoc } from 'firebase/firestore';
import SecNav from "../components/SecNav";

export default function Signup() {
  const [formData, setFormData] = useState({
    lname: '',
    fname: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
const showToast = (message, type = 'success') => {
setToast({ show: true, message, type });
setTimeout(() => {
setToast({ show: false, message: '', type: '' });
}, 4000);
};
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        fname: formData.fname,
        lname: formData.lname,
        email: formData.email,
        createdAt: new Date().toISOString()
      });

      // Redirect to home or dashboard
      showToast('Login successful', 'success');
setTimeout(() => {
  navigate('/');
}, 1000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
<Navbar />
<SecNav/>
<div className="signup-page">
<div className="signup-container">
<div className="signup-card">
<h1 className="signup-title">Create Account</h1>
<p className="signup-subtitle">Join Gulime and start shopping today</p>
            
{error && <div className="error-message">{error}</div>}
            
<form onSubmit={handleSubmit} className="signup-form">
      
<div className="form-group">
<label htmlFor="fname" className="form-label">First Name</label>
<input 
 type="text" 
 id="fname" 
 name="fname" 
 value={formData.fname}
 onChange={handleChange}
 className="form-input"
 required />
</div>

<div className="form-group">
<label htmlFor="username" className="form-label">Last Name</label>
<input 
type="text" 
id="lname" 
name="lname" 
value={formData.lname}
onChange={handleChange}
className="form-input"
required />
</div>
              
<div className="form-group">
<label htmlFor="email" className="form-label">Email Address</label>
<input 
type="email" 
id="email" 
name="email" 
value={formData.email}
onChange={handleChange}
className="form-input"
required />
</div>
              
<div className="form-group">
<label htmlFor="password" className="form-label">Password</label>
<input 
type="password" 
id="password" 
name="password" 
value={formData.password}
onChange={handleChange}
className="form-input"
required />
</div>
              
<button 
type="submit" 
className="signup-button"
disabled={loading}>
{loading ? 'Creating Account...' : 'Sign Up'}
</button>
</form>
            
<div className="signup-footer">
<p>Already have an account? <a href="/login" className="login-link">Sign In</a></p>
</div>
</div>
</div>
</div>
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