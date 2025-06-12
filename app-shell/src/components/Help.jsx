import Navbar from './Navbar';
import Footer from './Footer';
import SecNav from './SecNav';
import { Link } from 'react-router-dom';

export default function Help() {


  return (
    <>
      <Navbar />
 <SecNav/>
      <div className="help-page">
        <div className="help-container">
          <h1 className="help-title">Help & Support</h1>
          <p className="help-description">How can we assist you today?</p>
          <ul className="help-topics">
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/contact">Contact Support</Link></li>
            <li><Link to="/shipping">Shipping Information</Link></li>
            <li><Link to="/returns">Returns & Refunds</Link></li>
          </ul>
        </div>
        <div className="help-content">
          <h2 id="faq">Frequently Asked Questions</h2>
          <p>Find answers to common questions in our <Link to="/faq">FAQ section</Link>.</p>

          <h2 id="contact">Contact Support</h2>
          <p>If you need further assistance, please <Link to="/contact">contact our support team</Link>.</p>

          <h2 id="shipping">Shipping Information</h2>
<p>Learn about our shipping policies and options on our <Link to="/shipping">Shipping Information page</Link>.</p>

          <h2 id="returns">Returns & Refunds</h2>
          <p>For details on returns and refunds, visit our <a href="/returns">Returns & Refunds page</a>.</p>
        </div>
      </div>
      <Footer />
    </>
  );
}