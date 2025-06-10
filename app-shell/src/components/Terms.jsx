import Navbar from './Navbar';
import Footer from './Footer';
import SecNav from './SecNav';

export default function Terms() {


  return (
    <>
      <Navbar />
<SecNav/>
      <div className="terms-container">
        <h1 className="terms-title">Terms and Conditions</h1>
        <p className="terms-description">
          Welcome to Gulime! By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
        </p>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By using our services, you confirm that you accept these terms and conditions and that you agree to comply with them. If you do not agree to these terms, you must not use our site.
        </p>
        <h2>2. Changes to Terms</h2>
        <p>
          We may revise these terms at any time by amending this page. It is your responsibility to check this page from time to time for any changes we may make.
        </p>
        <h2>3. User Responsibilities</h2>
        <p>
          You are responsible for ensuring that all persons who access our site through your internet connection are aware of these terms and that they comply with them.
        </p>
        <h2>4. Intellectual Property Rights</h2>
        <p>
          All content on this site, including text, graphics, logos, and images, is the property of Gulime or its licensors and is protected by copyright laws.
        </p>
        <h2>5. Limitation of Liability</h2>
        <p>
          Gulime will not be liable for any loss or damage arising from your use of our site or services.
        </p>
        <h2>6. Governing Law</h2>
        <p>
          These terms and any disputes arising out of or in connection with them are governed by and construed in accordance with the laws of the jurisdiction in which Gulime operates.
        </p>
        <h2>7. Contact Us</h2>
   <p className="privacy-text">
          If you have any questions about this Privacy Policy, please
          <Link to="/contact" className="privacy-link">contact us</Link>.
        </p>
      </div>
      <Footer />
    </>
  );
}