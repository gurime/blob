import Navbar from './Navbar';
import Footer from './Footer';
import SecNav from './SecNav';

export default function Faq() {


  return (
    <>
      <Navbar />
      <SecNav />
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions below</p>
      </div>
      <div className="faq-container">
        <h2>What is Gulime?</h2>
        <p>Gulime is an online platform that connects users with a variety of services and products.</p>
        
        <h2>How do I create an account?</h2>
        <p>You can create an account by clicking on the "Sign Up" button on our homepage and filling out the registration form.</p>
        
        <h2>What payment methods do you accept?</h2>
        <p>We accept various payment methods including credit cards, debit cards, and PayPal.</p>
        
        <h2>How can I contact customer support?</h2>
         <p className="privacy-text">
          If you have any questions, please
          <Link to="/contact" className="privacy-link">contact us</Link>.
        </p>
        <h2>How do I reset my password?</h2>
        <p>If you forgot your password, you can reset it by clicking on the "Forgot Password?" link on the login page and following the instructions.</p>
        <h2>Can I change my account details?</h2>
        <p>Yes, you can change your account details by logging into your account and navigating to the "Account Settings" section.</p>
        <h2>What is your return policy?</h2>
        <p>We offer a 30-day return policy for most products. Please refer to our Return Policy page for more details.</p>
        <h2>Do you offer international shipping?</h2>
        <p>Yes, we offer international shipping to select countries. Shipping fees and delivery times may vary based on the destination.</p>
        <h2>How can I track my order?</h2>
        <p>Once your order is shipped, you will receive a tracking number via email. You can use this number to track your order on our website.</p>
        <h2>Where can I find your terms and conditions?</h2>      
        <p>You can find our terms and conditions on our Terms of Service page, accessible from the footer of our website.</p>
      </div>

      <Footer />
    </>
  );
}