import Footer from './Footer'
import Navbar from './Navbar'
import SecNav from './SecNav'

export default function Contact() {
  return (
    <>
    <Navbar/>
    <SecNav />
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-description">We would love to hear from you!</p>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required></textarea>
          <button type="submit" className="contact-button">Send Message</button>
        </form>
      </div>
    </div>
    <Footer/> 
    </>
  )
}
