import Navbar from './Navbar';
import Footer from './Footer';
import SecNav from './SecNav';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth, db } from '../db/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Cookie() {
const [isSignedIn, setIsSignedIn] = useState(false);
const [names, setNames] = useState('');

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
            setNames(fullName || userData.email || 'User');
          } else {
            setNames('User');
          }
          
          setIsSignedIn(true);
    
        } catch (error) {
          console.error("Error fetching user data:", error);
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
      <Navbar />
<SecNav/>      

     <div className="cookie-page">
  <div className="cookie-hero">
    <h1 className="cookie-title">Cookie Policy</h1>
    <p className="cookie-subtitle">Understanding How We Use Cookies</p>
    <p className="cookie-date">Last updated: June 2030</p>
  </div>

  <div className="cookie-container">

    <div className="cookie-section">
      <h2 className='cookie-subtitle'>Cookie Policy</h2>
      <p>
        This Cookie Policy explains how we, along with our affiliates and partners, use cookies and similar technologies when you visit our website. By continuing to use our site, you agree to the placement and use of cookies as outlined below.
      </p>
    </div>

    <div className="cookie-section">
      <h2 className='cookie-subtitle'>What are Cookies?</h2>
      <p>
        Cookies are small text files placed on your computer, smartphone, or other device when you access a website. They help websites function more efficiently and can provide information to the owners of the site. Cookies can be “session” cookies, which are deleted when you close your browser, or “persistent” cookies, which remain on your device for a set period of time.
      </p>
    </div>

    <div className="cookie-section">
      <h2 className='cookie-subtitle'>Types of Cookies We Use</h2>
      <ul className='cookie-list'>
        <p className='cookie-text'>
        We use various types of cookies to enhance your experience on our website. These include:
        </p>
        <li><strong>Essential Cookies:</strong> Required for core functionality such as security, network management, and accessibility. Without these, our website won&quot;t function properly.</li>
        <li><strong>Performance Cookies:</strong> Collect data about how users interact with the site, like pages visited and error messages. This helps us improve user experience.</li>
        <li><strong>Functional Cookies:</strong> Enable the site to remember your settings and preferences (such as language or region) to provide enhanced features.</li>
        <li><strong>Targeting/Advertising Cookies:</strong> Used to deliver ads relevant to your interests. These cookies track browsing habits and are often placed by third-party advertising networks.</li>
        <li><strong>Analytics Cookies:</strong> Help us understand traffic sources, how often visitors return, and how they navigate through the site.</li>
        <li><strong>Social Media Cookies:</strong> Enable you to share content via social networks and may track your browsing across other sites.</li>
      </ul>
    </div>

    <div className="cookie-section">
      <h2 className='cookie-subtitle'>Third-Party Cookies</h2>
      <p className='cookie-text'>
        We may also use cookies from third-party services to help us analyze how our website is used, to provide social media features, and to serve advertisements. These cookies are set by domains other than our own and may track your browsing activity across different websites.
        In some cases, we use cookies provided by trusted third parties. These include analytics providers like Google Analytics or embedded services such as YouTube, social media widgets, or chatbots. These third-party cookies may track your use of our website and other websites to build a profile of your interests.
      </p>
    </div>

    <div className="cookie-section">
      <h2 className='cookie-subtitle'>Managing Cookies</h2>
      <p className='cookie-text'>
        You have the right to decide whether to accept or reject cookies. You can manage your cookie preferences through your browser settings. Most browsers allow you to refuse cookies or alert you when a cookie is being sent.
        Most web browsers allow you to control cookies through their settings. You can usually find these settings in the &quot;Options&quot; or &quot;Preferences&quot; menu of your browser. Be aware that disabling certain cookies may impact the functionality and features of our website.
      </p>
      <p className='cookie-text'>
        You can also delete cookies that have already been set. However, please note that if you choose to delete cookies, you may need to re-enter your preferences on our site, and some features may not function as intended.
        For more information about how to manage or delete cookies, visit: <a className='cookie-link' href="https://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>
      </p>
      <p className='cookie-text'>
      {isSignedIn ? (
        <>
          You can also manage your cookie preferences through your <Link className='cookie-link' to="/profile">{names || 'profile'}</Link> page, where you can choose which types of cookies you want to allow or block.
          You may also opt out of targeted advertising through services such as:
        </>
      ) : (
        <span> 
        You can manage your cookie preferences through your browser settings, where you can choose which types of cookies you want to allow or block.
        </span>
      )}
    
     
        <ul>
          <li><a className='cookie-link' href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">AboutAds</a></li>
          <li><a className='cookie-link' href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer">Your Online Choices (EU)</a></li>
        </ul>
      </p>
      <p className='cookie-text'>
        Please note that opting out of cookies does not mean you will no longer see ads; it simply means that the ads you see may not be as relevant to you.
        For more details on how we use and protect your data, please refer to our <Link className='cookie-link' to="/privacy-policy">Privacy Policy</Link>.
      </p>
    </div>

    <div className="cookie-section">
      <h2 className='cookie-subtitle'>Changes to This Cookie Policy</h2>
      <p className='cookie-text'>
        We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, regulatory, or operational reasons. Please check back periodically to stay informed.
      </p>
    </div>

    <div className="cookie-section">
      <h2 className='cookie-subtitle'>Contact Us</h2>
      <p className='cookie-text'>
        If you have any questions about this Cookie Policy or how we use cookies, <Link className='cookie-link' to="/contact">Contact</Link>
      </p>
    </div>
<Link to="/terms" className="cookie-link">View Terms and Conditions</Link>
  </div>
</div>

      
<Footer />
    </>
  );
}