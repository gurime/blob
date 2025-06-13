import Navbar from './Navbar';
import Footer from './Footer';
import SecNav from './SecNav';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <>
      <Navbar />
      <SecNav/>
      <div className="privacy-page">
        <div className="privacy-hero">
          <h1 className="privacy-title">Privacy Policy</h1>
          <p className="privacy-subtitle">Your privacy is our priority</p>
          <p className="privacy-date">Last updated: June 2025</p>
        </div>
        
        <div className="privacy-container">
          <div className="privacy-intro">
            <p className="privacy-text">
              At Gulime, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our marketplace platform.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="privacy-subtitle">Information Collection</h2>
            <p className="privacy-text">
              We collect information from you when you visit our site, place an order, subscribe to our newsletter, or interact with us in other ways. This may include your name, email address, shipping address, payment information, and browsing behavior on our platform.
            </p>
            <div className="privacy-details">
              <h4>Types of information we collect:</h4>
              <ul>
                <li>Personal identification information (name, email, phone number)</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Purchase history and preferences</li>
                <li>Device and browser information</li>
              </ul>
            </div>
          </div>

          <div className="privacy-section">
            <h2 className="privacy-subtitle">Use of Information</h2>
            <p className="privacy-text">
              We use the information we collect to process transactions, improve our services, personalize your experience, and communicate with you about your orders, promotions, and updates to our services.
            </p>
            <div className="privacy-details">
              <h4>We use your information to:</h4>
              <ul>
                <li>Process and fulfill your orders</li>
                <li>Provide customer support</li>
                <li>Send promotional offers and updates (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </div>
          </div>

          <div className="privacy-section">
            <h2 className="privacy-subtitle">Data Security</h2>
            <p className="privacy-text">
              We implement a variety of security measures to maintain the safety of your personal information. This includes SSL encryption, secure payment processing, and regular security audits. However, no method of transmission over the internet is 100% secure.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="privacy-subtitle">Cookies</h2>
            <p className="privacy-text">
              Our site uses cookies to enhance user experience, remember your preferences, and analyze site traffic. You can choose to accept or decline cookies through your browser settings, though this may affect some site functionality.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="privacy-subtitle">Third-Party Disclosure</h2>
            <p className="privacy-text">
              We do not sell, trade, or otherwise transfer your personal information to outside parties without your consent, except as required by law or to trusted partners who assist us in operating our website and conducting our business.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="privacy-subtitle">Your Rights</h2>
            <p className="privacy-text">
              You have the right to access, update, or delete your personal information. You may also opt out of marketing communications at any time. Contact us to exercise these rights.
            </p>
          </div>

          <div className="privacy-section">
            <h2 className="privacy-subtitle">Changes to This Policy</h2>
            <p className="privacy-text">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any changes will be posted on this page with an updated effective date.
            </p>
          </div>

          <div className="privacy-contact">
            <h2 className="privacy-subtitle">Contact Us</h2>
            <p className="privacy-text">
              If you have any questions about this Privacy Policy, please
              <Link to="/contact" className="privacy-link"> contact us</Link>. We`re here to help address any concerns you may have about your privacy and data protection.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}