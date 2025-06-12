import { Link } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'
import SecNav from './SecNav'

export default function About() {
  return (
    <>
    <Navbar/>
    <SecNav/>
    <h1>About</h1>
    <p>
      Gulime is a platform dedicated to providing high-quality products and exceptional customer service. Our mission is to create a seamless shopping experience for our customers, offering a wide range of products that cater to diverse needs and preferences.
    </p>
    <p>
      We believe in transparency, integrity, and innovation. Our team is committed to continuously improving our services and ensuring that our customers have access to the best products available.
    </p>
    <p>
      Thank you for choosing Gulime. We look forward to serving you and exceeding your expectations.
    </p>
    <p>
      For more information about our policies, please visit our <Link to="/terms">Terms and Conditions</Link> and <Link to="/privacy">Privacy Policy</Link> pages.
    </p>
    <p>
      If you have any questions or need assistance, please feel free to <Link to="/contact">contact us</Link>.
    </p>
    <p>
      Stay connected with us on our social media channels for the latest updates and promotions.
    </p>
    <p>
      Thank you for being a part of the Gulime community!
    </p> 
    <Footer/>
    </>
  )
}
