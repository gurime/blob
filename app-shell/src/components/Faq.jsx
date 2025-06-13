import Navbar from './Navbar';
import Footer from './Footer';
import SecNav from './SecNav';
import { Link } from 'react-router-dom';

export default function Faq() {
  return (
    <div className="faq-page">
      <Navbar />
      <SecNav />
      
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions below</p>
      </div>

      <div className="faq-container">
        <div className="faq-highlight">
          <h2>What is Gulime?</h2>
          <p>Gulime is an online platform that connects users with a variety of services and products, designed to make your shopping and service experience seamless and enjoyable.</p>
        </div>

        <div className="faq-item">
          <h2>How do I create an account?</h2>
          <p>You can create an account by clicking on the &quot;Sign Up&quot; button on our homepage and filling out the registration form with your email address, password, and basic information. Once submitted, you&quot;ll receive a confirmation email to verify your account.</p>
        </div>

        <div className="faq-item">
          <h2>What payment methods do you accept?</h2>
          <p>We accept various payment methods including major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, and other secure digital payment options. All transactions are processed through encrypted, secure payment gateways.</p>
        </div>

        <div className="faq-item">
          <h2>How can I contact customer support?</h2>
          <p className="privacy-text">
            Our customer support team is here to help! You can reach us through multiple channels. For the fastest response, please{' '}
            <Link to="/contact" className="privacy-link">contact us</Link> through our dedicated support page where you can submit a ticket or find live chat options.
          </p>
        </div>

        <div className="faq-item">
          <h2>How do I reset my password?</h2>
          <p>If you forgot your password, you can reset it by clicking on the &quot;Forgot Password?&quot; link on the login page. Enter your email address, and we&quot;ll send you a secure link to create a new password. The link will expire after 24 hours for security purposes.</p>
        </div>

        <div className="faq-item">
          <h2>Can I change my account details?</h2>
          <p>Yes, you can easily change your account details by logging into your account and navigating to the &quot;Account Settings&quot; or &quot;Profile&quot; section. Here you can update your personal information, email address, password, and notification preferences.</p>
        </div>

        <div className="faq-item">
          <h2>What is your return policy?</h2>
          <p>We offer a 30-day return policy for most products from the date of delivery. Items must be in their original condition, unused, and in original packaging. Some restrictions apply to certain categories like digital products, personalized items, and perishable goods. Please refer to our Return Policy page for complete details.</p>
        </div>

        <div className="faq-item">
          <h2>Do you offer international shipping?</h2>
          <p>Yes, we offer international shipping to many countries worldwide. Shipping fees and delivery times vary based on the destination and shipping method selected. Please note that customers are responsible for any customs duties, taxes, or additional fees imposed by their country`s customs office.</p>
        </div>

        <div className="faq-item">
          <h2>How can I track my order?</h2>
          <p>Once your order is shipped, you will receive a confirmation email with a tracking number and a link to track your package. You can also log into your account and visit the &quot;Order History&quot; section to view tracking information for all your orders.</p>
        </div>

        <div className="faq-item">
          <h2>Is my personal information secure?</h2>
          <p>Absolutely! We take your privacy and security seriously. We use industry-standard encryption and security measures to protect your personal information. We never share your data with third parties without your consent, except as outlined in our Privacy Policy.</p>
        </div>

        <div className="faq-item">
          <h2>How do I cancel an order?</h2>
          <p>You can cancel an order within 1 hour of placing it by logging into your account and selecting &quot;Cancel Order&quot; from your order history. After this window, please contact customer support immediately, and we&quot;ll do our best to accommodate your request if the order hasn`t been shipped yet.</p>
        </div>

        <div className="faq-item">
          <h2>Do you offer bulk or wholesale pricing?</h2>
          <p>Yes, we offer special pricing for bulk orders and wholesale customers. Please contact our business sales team through our contact page with details about your requirements, and we&quot;ll provide you with a customized quote and pricing structure.</p>
        </div>

        <div className="faq-item">
          <h2>Where can I find your terms and conditions?</h2>      
          <p>You can find our comprehensive terms and conditions on our <Link to="/terms" className="privacy-link">Terms of Service</Link> page, which is accessible from the footer of our website. We recommend reviewing these terms as they outline your rights and responsibilities when using our services.</p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}