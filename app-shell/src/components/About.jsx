import { Link } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'
import SecNav from './SecNav'

export default function About() {
  return (
    <>
      <Navbar/>
      <SecNav/>
      <div className="about-container">
        <div className="about-hero">
          <h1 className="about-title">About Gulime</h1>
          <p className="about-subtitle">Your trusted marketplace for quality products</p>
        </div>
        
        <div className="about-content">
          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              Gulime is a platform dedicated to providing high-quality products and exceptional customer service. Our mission is to create a seamless shopping experience for our customers, offering a wide range of products that cater to diverse needs and preferences.
            </p>
          </div>

          <div className="about-section">
            <h2>Our Values</h2>
            <p>
              We believe in transparency, integrity, and innovation. Our team is committed to continuously improving our services and ensuring that our customers have access to the best products available.
            </p>
          </div>

          <div className="about-section">
            <h2>What We Offer</h2>
            <p>
              From everyday essentials to specialty items including automotive products, electronics, home appliances, and much more, Gulime connects you with trusted sellers worldwide. We pride ourselves on our diverse marketplace that serves customers across all categories.
            </p>
          </div>

          <div className="about-section">
            <h2>Our Commitment</h2>
            <p>
              Thank you for choosing Gulime. We look forward to serving you and exceeding your expectations. Our dedicated team works around the clock to ensure your shopping experience is smooth, secure, and satisfying.
            </p>
          </div>

          <div className="about-links">
            <p>
              For more information about our policies, please visit our <Link to="/terms" className="about-link">Terms and Conditions</Link> and <Link to="/privacy" className="about-link">Privacy Policy</Link> pages.
            </p>
            <p>
              If you have any questions or need assistance, please feel free to <Link to="/contact" className="about-link">contact us</Link>.
            </p>
            <p>
              Stay connected with us on our social media channels for the latest updates and promotions.
            </p>
            <p className="about-closing">
              Thank you for being a part of the Gulime community!
            </p>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}