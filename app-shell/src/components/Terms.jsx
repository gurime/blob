import Navbar from './Navbar';
import Footer from './Footer';
import SecNav from './SecNav';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="terms-page">
      <Navbar />
      <SecNav />
      
      <div className="terms-hero">
        <h1 className="terms-title">Terms and Conditions</h1>
        <p className="terms-subtitle">Legal Terms of Service</p>
        <p className="terms-date">Last updated: December 2024</p>
      </div>

      <div className="terms-container">
        <p className="terms-description">
          Welcome to Gulime! By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
        </p>

        <div className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By using our services, you confirm that you accept these terms and conditions and that you agree to comply with them. If you do not agree to these terms, you must not use our site.
          </p>
        </div>

        <div className="terms-section">
          <h2>2. Changes to Terms</h2>
          <p>
            We may revise these terms at any time by amending this page. It is your responsibility to check this page from time to time for any changes we may make. Your continued use of our site following the posting of revised terms means that you accept and agree to the changes.
          </p>
        </div>

        <div className="terms-section">
          <h2>3. User Responsibilities</h2>
          <p>
            You are responsible for ensuring that all persons who access our site through your internet connection are aware of these terms and that they comply with them. You must not use our site in any way that causes, or may cause, damage to the site or impairment of the availability or accessibility of the site.
          </p>
        </div>

        <div className="terms-section">
          <h2>4. Intellectual Property Rights</h2>
          <p>
            All content on this site, including text, graphics, logos, images, audio clips, digital downloads, data compilations, and software, is the property of Gulime or its licensors and is protected by copyright laws. You may not reproduce, distribute, or create derivative works from any content without our express written permission.
          </p>
        </div>

        <div className="terms-section">
          <h2>5. User Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>
        </div>

        <div className="terms-section">
          <h2>6. Prohibited Uses</h2>
          <p>
            You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts, to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances, to infringe upon or violate our intellectual property rights or the intellectual property rights of others, or to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate.
          </p>
        </div>

        <div className="terms-section">
          <h2>7. Limitation of Liability</h2>
          <p>
            Gulime will not be liable for any loss or damage arising from your use of our site or services. In no case shall Gulime, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers, or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.
          </p>
        </div>

        <div className="terms-section">
          <h2>8. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless Gulime and our subsidiaries, affiliates, and all respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys` fees and expenses, made by any third party due to or arising out of your use of the service.
          </p>
        </div>

        <div className="terms-section">
          <h2>9. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the terms.
          </p>
        </div>

        <div className="terms-section">
          <h2>10. Governing Law</h2>
          <p>
            These terms and any disputes arising out of or in connection with them are governed by and construed in accordance with the laws of the jurisdiction in which Gulime operates. Any legal suit, action, or proceeding arising out of or related to these terms shall be instituted exclusively in the courts of that jurisdiction.
          </p>
        </div>

        <div className="terms-contact">
          <h2>Contact Us</h2>
          <p className="privacy-text">
            If you have any questions about these Terms and Conditions, please{' '}
            <Link to="/contact" className="privacy-link">contact us</Link>.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}