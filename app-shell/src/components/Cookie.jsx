import Navbar from './Navbar';
import Footer from './Footer';
import SecNav from './SecNav';
import { Link } from 'react-router-dom';

export default function Cookie() {


  return (
    <>
      <Navbar />
<SecNav/>      

      <div className="cookie-policy"></div>
        <h1>Cookie Policy</h1>
        <p>
          This Cookie Policy explains how Gulime uses cookies and similar technologies to recognize you when you visit our website at gulime.com. It explains what these technologies are, why we use them, and your rights to control our use of them.
        </p>
        <h2>What Are Cookies?</h2>
        <p>
          Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the site owners.
        </p>
        <h2>Why Does Gulime Use Cookies?</h2>
        <p>
          Gulime uses cookies for several reasons, including:
          <ul>
            <li>To enable essential functions of the website.</li>
            <li>To analyze how visitors use our site.</li>
            <li>To personalize content and ads.</li>
            <li>To provide social media features.</li>
          </ul>
        </p>
        <h2>Your Choices Regarding Cookies</h2>
        <p>
          You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in our cookie banner or by adjusting your browser settings.
        </p>
<Footer />
    </>
  );
}