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
        <div className="help-hero">
          <h1 className="help-title">Help & Support</h1>
          <p className="help-description">How can we assist you today?</p>
        </div>
        
        <div className="help-container">
          <div className="help-navigation">
            <h2>Quick Links</h2>
            <ul className="help-topics">
              <li><Link to="/faq" className="help-nav-link">FAQs</Link></li>
              <li><Link to="/contact" className="help-nav-link">Contact Support</Link></li>
              <li><Link to="/shipping" className="help-nav-link">Shipping Information</Link></li>
              <li><Link to="/returns" className="help-nav-link">Returns & Refunds</Link></li>
            </ul>
          </div>

          <div className="help-content">
            <div className="help-section">
              <h2 id="faq">Frequently Asked Questions</h2>
              <p>Find answers to common questions in our <Link to="/faq" className="help-link">FAQ section</Link>. We`ve compiled the most frequently asked questions from our customers to help you get quick solutions.</p>
              <div className="help-preview">
                <h4>Popular Questions:</h4>
                <ul>
                  <li>How do I track my order?</li>
                  <li>What payment methods do you accept?</li>
                  <li>How long does shipping take?</li>
                  <li>Can I modify my order after placing it?</li>
                </ul>
              </div>
            </div>

            <div className="help-section">
              <h2 id="contact">Contact Support</h2>
              <p>If you need further assistance, please <Link to="/contact" className="help-link">contact our support team</Link>. Our dedicated customer service representatives are available 24/7 to help resolve any issues you may have.</p>
              <div className="help-preview">
                <h4>Support Hours:</h4>
                <ul>
                  <li>Phone: 24/7 availability</li>
                  <li>Live Chat: Monday - Friday, 8 AM - 8 PM</li>
                  <li>Email: Response within 24 hours</li>
                </ul>
              </div>
            </div>

            <div className="help-section">
              <h2 id="shipping">Shipping Information</h2>
              <p>Learn about our shipping policies and options on our <Link to="/shipping" className="help-link">Shipping Information page</Link>. We offer various shipping methods to meet your needs and ensure your products arrive safely and on time.</p>
              <div className="help-preview">
                <h4>Shipping Options:</h4>
                <ul>
                  <li>Standard Shipping (5-7 business days)</li>
                  <li>Express Shipping (2-3 business days)</li>
                  <li>Overnight Shipping (1 business day)</li>
                  <li>International Shipping available</li>
                </ul>
              </div>
            </div>

            <div className="help-section">
              <h2 id="returns">Returns & Refunds</h2>
              <p>For details on returns and refunds, visit our <Link to="/returns" className="help-link">Returns & Refunds page</Link>. We want you to be completely satisfied with your purchase, and we make the return process as simple as possible.</p>
              <div className="help-preview">
                <h4>Return Policy Highlights:</h4>
                <ul>
                  <li>30-day return window</li>
                  <li>Free return shipping on defective items</li>
                  <li>Easy online return process</li>
                  <li>Full refund or exchange options</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}