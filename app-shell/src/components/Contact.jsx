import Footer from './Footer'
import Navbar from './Navbar'
import SecNav from './SecNav'
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../db/firebase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

export default function Contact() {
  const [names, setNames] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
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
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            // Get the full name from fname and lname
            const fullName = `${userData.fname || ''} ${userData.lname || ''}`.trim();
            const userName = fullName || userData.email || 'User';
            setNames(userName);
            setUserEmail(userData.email || user.email);
            
            // Pre-fill form with user data
            setFormData(prev => ({
              ...prev,
              name: userName,
              email: userData.email || user.email
            }));
          } else {
            setNames('User');
            setUserEmail(user.email);
            setFormData(prev => ({
              ...prev,
              name: 'User',
              email: user.email
            }));
          }
          setIsSignedIn(true);
        } catch (error) {
          setIsSignedIn(true);
          setNames('User');
          setUserEmail(user.email);
          setFormData(prev => ({
            ...prev,
            name: 'User',
            email: user.email
          }));
        }
      } else {
        setIsSignedIn(false);
        setNames('');
        setUserEmail('');
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Add the contact message to Firestore
      await addDoc(collection(db, 'contactMessages'), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        timestamp: new Date(),
        userId: auth.currentUser?.uid || null,
        isRegisteredUser: isSignedIn
      });

      showToast('Thank you for your message! We\'ll get back to you soon.');
      
      // Clear message field but keep name/email for registered users
      if (isSignedIn) {
        setFormData(prev => ({
          ...prev,
          message: ''
        }));
      } else {
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      }
    } catch (error) {
      showToast('Sorry, there was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <SecNav />
      <div className="contact-page">
        <div className="contact-container">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-description">We would love to hear from you!</p>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input 
                type="text" 
                name="name"
                placeholder="Your Name" 
                value={formData.name}
                onChange={handleInputChange}
                required 
                className="form-input"
              />
              <input 
                type="email" 
                name="email"
                placeholder="Your Email" 
                value={formData.email}
                onChange={handleInputChange}
                required 
                className="form-input"
              />
            </div>
            
            <textarea 
              name="message"
              placeholder="Your Message" 
              value={formData.message}
              onChange={handleInputChange}
              required 
              className="form-textarea"
              rows="6"
            ></textarea>
            
            <button 
              type="submit" 
              className="contact-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {submitMessage && (
            <div className={`submit-message ${submitMessage.includes('error') ? 'error' : 'success'}`}>
              {submitMessage}
            </div>
          )}
        </div>

        <div className="info-section">
          <div className="info-grid">
            <div className="info-card">
              <h3>Make Money With Us</h3>
              <div className="info-content">
                <p>Partner with Gulime and start earning through our affiliate program.</p>
                <p>Sell your products on our platform and reach millions of customers.</p>
                <p>Join our delivery network and earn flexible income.</p>
                <p>Become a brand ambassador and earn commissions.</p>
                <p>Refer friends and earn rewards for every successful referral.</p>
              </div>
            </div>
            
            <div className="info-card">
              <h3>Customer Service</h3>
              <div className="info-content">
                <p>24/7 customer support for all your shopping needs.</p>
                <p>Easy returns and refunds within 30 days.</p>
                <p>Track your orders in real-time with our app.</p>
                <p>Live chat support for instant assistance.</p>
                <p>Comprehensive FAQ section for quick answers.</p>
              </div>
            </div>
            
            <div className="info-card">
              <h3>About Gulime</h3>
              <div className="info-content">
                <p>Your trusted online marketplace for quality products.</p>
                <p>Connecting buyers and sellers across the globe.</p>
                <p>Committed to providing exceptional shopping experiences.</p>
                <p>Supporting local businesses and entrepreneurs.</p>
                <p>Building the future of e-commerce together.</p>
              </div>
            </div>
            
            <div className="info-card">
              <h3>Getting Started</h3>
              <div className="info-content">
                <p>Create your free account in less than 2 minutes.</p>
                <p>Browse millions of products across all categories.</p>
                <p>Add items to your cart and checkout securely.</p>
                <p>Track your orders and manage your account easily.</p>
                <p>Join our community of satisfied customers worldwide.</p>
              </div>
            </div>
          </div>
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