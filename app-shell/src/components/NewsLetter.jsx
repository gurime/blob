/* eslint-disable no-unused-vars */
import Navbar from './Navbar';
import Footer from './Footer';
import SecNav from './SecNav';
import { useEffect, useState } from 'react';
import { addDoc, collection, getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../db/firebase';

export default function NewsLetter() {
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
        // Add the newsletter subscription to Firestore
        await addDoc(collection(db, 'NewsLetter'), {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          timestamp: new Date(),
          userId: auth.currentUser?.uid || null,
          isRegisteredUser: isSignedIn
        });
  
        showToast('Thank you for subscribing! Welcome to the Gulime community.');
        
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
        showToast('Sorry, there was an error with your subscription. Please try again.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <>
      <Navbar/>
      <SecNav/>
      
      {/* Hero Section */}
      <section className="newsletter-hero">
        <div className="newsletter-icon">📧</div>
        <div className="newsletter-hero-content">
          <h1>Stay In The Loop</h1>
          <p>
            Join thousands of subscribers and get exclusive updates, deals, and insider news 
            delivered straight to your inbox. Be the first to know about new products, sales, and more!
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="newsletter-main">
        <div className="newsletter-container">
          <div className="newsletter-content">
            {/* Newsletter Info */}
            <div className="newsletter-info">
              <h2>Why Subscribe?</h2>
              <p>
                Our weekly newsletter brings you the latest updates from the world of ecommerce, 
                exclusive deals on top products, and insider tips to help you make the best purchasing decisions.
              </p>
              
              <ul className="newsletter-benefits">
                <li>Exclusive early access to sales and promotions</li>
                <li>Weekly curated product recommendations</li>
                <li>Industry insights and trend analysis</li>
                <li>Special subscriber-only discounts</li>
                <li>New product announcements before anyone else</li>
                <li>Expert buying guides and reviews</li>
              </ul>
              
              <p>
                Join our community of smart shoppers who save money and stay ahead of the curve. 
                No spam, just valuable content delivered weekly.
              </p>
            </div>

            {/* Subscription Form */}
            <div className="newsletter-form">
              <h3>Subscribe Now</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">What interests you most? (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your interests, preferred product categories, or what you'd like to see in our newsletter..."
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Stats */}
      <section className="newsletter-stats">
        <div className="newsletter-container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">25K+</span>
              <span className="stat-label">Active Subscribers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">150+</span>
              <span className="stat-label">Weekly Deals</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfaction Rate</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Product Categories</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Features */}
      <section className="newsletter-features">
        <div className="newsletter-container">
          <h2 className="newsletter-title">What You'll Get</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🎯</span>
              <h4>Curated Deals</h4>
              <p>Hand-picked deals and discounts on products you actually want, saving you time and money on every purchase.</p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">🚗</span>
              <h4>Automotive Insights</h4>
              <p>Expert reviews, buying guides, and exclusive deals on cars, parts, and accessories from trusted dealers.</p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">📱</span>
              <h4>Tech Updates</h4>
              <p>Stay ahead with the latest gadgets, electronics, and tech trends. Get early access to new product launches.</p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">💡</span>
              <h4>Smart Shopping Tips</h4>
              <p>Insider secrets, price tracking alerts, and expert advice to help you make informed purchasing decisions.</p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">🎁</span>
              <h4>Exclusive Offers</h4>
              <p>Subscriber-only promotions, flash sales, and special discounts you won't find anywhere else.</p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">📊</span>
              <h4>Market Trends</h4>
              <p>Stay informed about market trends, price changes, and seasonal buying opportunities across all categories.</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer/>
      
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
  )
}