/* eslint-disable no-unused-vars */
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import navlogo from '../img/gulime.png';
import navlogos from '../img/gulime_g.png'
import { useEffect, useState } from 'react';
import { auth, db } from '../db/firebase';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';

export default function Footer() { 
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [names, setNames] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current route is /contact
  const isContactPage = location.pathname === '/contact';

  const scrollToTopNav = () => {
    const nav = document.getElementById('top-navbar');
    if (nav) nav.scrollIntoView({ behavior: 'smooth' });
  };

  const activeStyle = ({ isActive }) => ({
    backgroundColor: isActive ? 'blue' : '',
    color: isActive ? 'white' : '',
    textDecoration: 'none'
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
      // Add the newsletter signup to Firestore
      await addDoc(collection(db, 'News Letter'), {
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
      showToast('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  return(
<>
<footer className="footer">
    {!isContactPage && (
          <div
          style={{
            width: '100%',
  borderBottom: '1px solid #fff',
  paddingBottom: '10px',
  paddingTop: '10px',
          }}
          >
            <form className="contact-form" onSubmit={handleSubmit}>
              <h1>Gulime Newsletter</h1>
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
                placeholder="Your Message (Optional)" 
                value={formData.message}
                onChange={handleInputChange}
                className="form-textarea"
                rows="6"
              ></textarea>
              
              <button 
                type="submit" 
                className="contact-button" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing Up...' : 'Subscribe to Newsletter'}
              </button>
            </form>

            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes('error') ? 'error' : 'success'}`}>
                {submitMessage}
              </div>
            )}
          </div> 
        )}
 
<div className="flex-footer">
<div className="footer-tablebox"> 
<div className="footer-headline">Make Money With Us</div>
<ul className="footer-navlink">
<li><Link to="/sell">Sell on Gulime</Link></li>
<li><Link to="/affiliate">Affiliate Program</Link></li>
<li><Link to="/business">Business Solutions </Link></li>
<li><Link to="/advertise">Advertise Your Products</Link></li>
<li><Link to="/wholesale">Wholesale Opportunities</Link></li>
</ul>
</div>
{/*first tablebox stops here*/}
<div className="footer-tablebox"> 
<div className="footer-headline">Fashion</div>
<ul className="footer-navlink">
<li><Link to="/fashion/womens-clothing">Women&apos;s Clothing</Link></li>
<li><Link to="/fashion/mens-clothing">Men&apos;s Clothing</Link></li>
<li><Link to="/fashion/shoes">Shoes</Link></li>
<li><Link to="/fashion/watches">Watches</Link></li>
<li><Link to="/fashion/accessories">Accessories</Link></li>
</ul>
</div>
{/*seconds tablebox stops here*/}
<div className="footer-tablebox"> 
<div className="footer-headline">Home & Living</div>
<ul className="footer-navlink">
<li><Link to="/home/kitchen-essentials">Kitchen Essentials</Link></li>
<li><Link to="/home/bedding-and-bath">Bedding & Bath</Link></li>
<li><Link to="/home/lighting">Lighting</Link></li>
<li><Link to="/home/storage-and-organization">Storage & Organization</Link></li>
<li><Link to="/home/decor">Decor</Link></li>
</ul>
</div>
{/*third tablebox stops here*/}
<div className="footer-tablebox" style={{borderRight:'none' ,borderBottom:'none'}}> 
<div className="footer-headline">Text</div>
<ul className="footer-navlink">
<li><Link to="/health/skincare">Skincare</Link></li>
<li><Link to="/health/makeup">Makeup</Link></li>
<li><Link to="/health/haircare">Hair Care </Link></li>
<li><Link to="/health/vitamins">Vitamins</Link></li>
<li><Link to="/health/medical">Medical Supplies</Link></li>
</ul>
</div>
{/*fourth tablebox stops here*/}


</div>
<hr style={{color:'#fff',border:'solid 1px'}}/>

<div  className="nav logo-footer">
<img  title='Home Page' style={{marginRight:'auto '}} onClick={() => navigate('/')} src={navlogo}  alt='...'  />






<div className="navlinks sm-navlink" >
<NavLink to='/contact' style={activeStyle} > Contact Us</NavLink>
<NavLink to='/about' style={activeStyle}>About Us</NavLink>
<NavLink to='/help' style={activeStyle}>Help</NavLink>
<NavLink to='/faq' style={activeStyle}>FAQ</NavLink> 
<NavLink  to='/terms' style={activeStyle}> Terms of Use</NavLink> 
<NavLink  to='/privacy' style={activeStyle}>Privacy Policies</NavLink>
<NavLink style={activeStyle} to="/shippinginfo" >Shipping Information</NavLink>
<NavLink style={activeStyle} to="/careers">Careers</NavLink>
<NavLink style={activeStyle} to="/press">Press Releases </NavLink>
<NavLink style={activeStyle} to="/investors">Investor Relations</NavLink>
<NavLink style={activeStyle} to="/sustainability">Sustainability</NavLink>
<NavLink style={activeStyle} to="/returns">Returns & Refunds</NavLink>
<NavLink style={activeStyle}  to='/cookie'>Cookie Policies</NavLink>


</div>
</div>
<hr />
<div style={{
color:'#fff',
padding:'1rem 0',
textAlign:'center'
}}>
   &#169;2030 Gulime, LLC All Rights Reserved <br />

</div>
<hr />

<div style={{
color:'#fff',
padding:'1rem 0',
textAlign:'center'
}}>
   <br />
    This material may not be published, broadcast, rewritten, or redistributed. 
</div>


<div className="footer-logo-box">

<img title='To Top'  onClick={scrollToTopNav}  src={navlogos} alt="..."     />

</div>
</footer>


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
