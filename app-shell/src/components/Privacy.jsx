import Navbar from './Navbar';
import Footer from './Footer';
import SecNav from './SecNav';
import { Link } from 'react-router-dom';

export default function Privacy() {


  return (
    <>
      <Navbar />
      <SecNav/>
      <div className="privacy-container">
        <h1 className="privacy-title">Privacy Policy</h1>
        <p className="privacy-text">
          At Gulime, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data.
        </p>
        <h2 className="privacy-subtitle">Information Collection</h2>
        <p className="privacy-text">
          We collect information from you when you visit our site, place an order, subscribe to our newsletter, or interact with us in other ways. This may include your name, email address, shipping address, and payment information.
        </p>
        <h2 className="privacy-subtitle">Use of Information</h2>
        <p className="privacy-text">
          We use the information we collect to process transactions, improve our services, and communicate with you about your orders and promotions.
        </p>
        <h2 className="privacy-subtitle">Data Security</h2>
        <p className="privacy-text">
          We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the internet is 100% secure.
        </p>
        <h2 className="privacy-subtitle">Cookies</h2>
        <p className="privacy-text">
          Our site uses cookies to enhance user experience. You can choose to accept or decline cookies through your browser settings.
        </p>
        <h2 className="privacy-subtitle">Third-Party Disclosure</h2>
        <p className="privacy-text">
          We do not sell, trade, or otherwise transfer your personal information to outside parties without your consent, except as required by law.
        </p>
        <h2 className="privacy-subtitle">Changes to This Policy</h2>
        <p className="privacy-text">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.
        </p>
        <h2 className="privacy-subtitle">Contact Us</h2>
         <p className="privacy-text">
          If you have any questions about this Privacy Policy, please
          <Link to="/contact" className="privacy-link">contact us</Link>.
        </p>
      </div>
      <Footer />
    </>
  );
}