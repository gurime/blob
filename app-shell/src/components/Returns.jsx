import Footer from "./Footer";
import Navbar from "./Navbar";
import SecNav from "./SecNav";

export default function Returns() {
  return (
    <>
    <Navbar/>
    <SecNav/>
    <div style={{
      background:'linear-gradient(135deg, #4a90e2 0%, #357abd 50%, #2c5aa0 100%)'   
    }}>
     <div className="returns-container">
      <div className="returns-header">
        <h1>Returns & Refunds</h1>
        <p>We want you to be completely satisfied with your purchase. Learn about our hassle-free return policy.</p>
      </div>

      <div className="returns-content">
        <div className="returns-section">
          <h2>Return Policy Overview</h2>
          <div className="policy-overview">
            <div className="policy-highlight">
              <h3>30-Day Return Window</h3>
              <p>You have 30 days from the delivery date to return most items for a full refund or exchange.</p>
            </div>
            
            <div className="policy-highlight">
              <h3>Free Return Shipping</h3>
              <p>We provide prepaid return labels for most returns within the United States.</p>
            </div>
            
            <div className="policy-highlight">
              <h3>Easy Online Returns</h3>
              <p>Start your return process online through your account or our returns portal.</p>
            </div>
          </div>
        </div>

        <div className="returns-section">
          <h2>How to Return an Item</h2>
          <div className="return-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Start Your Return</h3>
                <p>Log into your account and go to &quot;Order History&quot; or visit our returns portal. Select the items you want to return and choose your reason.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Print Return Label</h3>
                <p>We&apos;ll email you a prepaid return shipping label. Print it out and attach it to your package.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Package Your Items</h3>
                <p>Place items in their original packaging if possible. Include all accessories, manuals, and original tags.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Drop Off Package</h3>
                <p>Drop off your package at any authorized shipping location or schedule a pickup from your home.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Receive Your Refund</h3>
                <p>Once we receive and process your return, your refund will be issued within 3-5 business days.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="returns-section">
          <h2>Return Conditions</h2>
          <div className="conditions-grid">
            <div className="condition-card returnable">
              <h3>Items We Accept</h3>
              <ul>
                <li>Unopened items in original packaging</li>
                <li>Items with original tags attached</li>
                <li>Electronics in working condition with all accessories</li>
                <li>Clothing and accessories unworn and unwashed</li>
                <li>Books in sellable condition</li>
                <li>Home goods unused and in original packaging</li>
              </ul>
            </div>
            
            <div className="condition-card non-returnable">
              <h3>Items We Cannot Accept</h3>
              <ul>
                <li>Personalized or customized items</li>
                <li>Perishable goods and food items</li>
                <li>Intimate apparel and swimwear</li>
                <li>Items damaged by misuse or normal wear</li>
                <li>Digital downloads and gift cards</li>
                <li>Items returned after 30 days</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="returns-section">
          <h2>Refund Information</h2>
          <div className="refund-info">
            <div className="refund-item">
              <h3>Refund Processing Time</h3>
              <p>Once we receive your returned item, we&apos;ll inspect it and notify you of the approval or rejection of your refund. If approved, your refund will be processed within 3-5 business days.</p>
            </div>
            
            <div className="refund-item">
              <h3>Refund Method</h3>
              <p>Refunds will be issued to your original payment method. Credit card refunds may take 5-10 business days to appear on your statement, depending on your card issuer.</p>
            </div>
            
            <div className="refund-item">
              <h3>Partial Refunds</h3>
              <p>We may issue partial refunds for items that show signs of use, missing parts, or damage not due to our error. You&apos;ll be notified before processing any partial refund.</p>
            </div>
            
            <div className="refund-item">
              <h3>Return Shipping Costs</h3>
              <p>Return shipping is free for most items within the US. For international returns or items over 50 lbs, return shipping fees may apply and will be deducted from your refund.</p>
            </div>
          </div>
        </div>

        <div className="returns-section">
          <h2>Exchanges</h2>
          <div className="exchange-info">
            <div className="exchange-option">
              <h3>Size or Color Exchanges</h3>
              <p>Need a different size or color? We&apos;ll expedite your exchange at no extra cost. The new item will ship as soon as we receive your return.</p>
            </div>
            
            <div className="exchange-option">
              <h3>Defective Item Exchanges</h3>
              <p>If you received a defective item, we&apos;ll send a replacement immediately and provide a prepaid return label for the defective item.</p>
            </div>
            
            <div className="exchange-option">
              <h3>Price Difference</h3>
              <p>If your exchange item costs more, we&apos;ll charge the difference. If it costs less, we&apos;ll refund the difference to your original payment method.</p>
            </div>
          </div>
        </div>

        <div className="returns-section">
          <h2>Special Return Situations</h2>
          <div className="special-situations">
            <div className="situation-item">
              <h3>Holiday Returns</h3>
              <p>Items purchased between November 1st and December 31st can be returned until January 31st of the following year, giving you extra time for holiday purchases.</p>
            </div>
            
            <div className="situation-item">
              <h3>Damaged or Wrong Items</h3>
              <p>If you received a damaged or incorrect item, contact us immediately. We&apos;ll arrange for immediate replacement or refund, and you won&apos;t need to return the item in some cases.</p>
            </div>
            
            <div className="situation-item">
              <h3>Bulk or Wholesale Returns</h3>
              <p>Different return policies may apply for bulk orders over $1,000. Please contact our wholesale team for specific return procedures and conditions.</p>
            </div>
            
            <div className="situation-item">
              <h3>International Returns</h3>
              <p>International customers are responsible for return shipping costs. We recommend using trackable shipping methods. Customs fees are non-refundable.</p>
            </div>
          </div>
        </div>

        <div className="returns-section">
          <h2>Return Status Tracking</h2>
          <div className="tracking-info">
            <h3>Track Your Return</h3>
            <p>You can track the status of your return through your account dashboard or by using the return tracking number we provide.</p>
            
            <div className="status-stages">
              <div className="status-stage">
                <h4>Return Initiated</h4>
                <p>You&apos;ve started the return process and received your return label.</p>
              </div>
              
              <div className="status-stage">
                <h4>Package in Transit</h4>
                <p>Your return package is on its way to our warehouse.</p>
              </div>
              
              <div className="status-stage">
                <h4>Return Received</h4>
                <p>We&apos;ve received your package and it&apos;s being inspected.</p>
              </div>
              
              <div className="status-stage">
                <h4>Refund Processed</h4>
                <p>Your return has been approved and refund has been issued.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="returns-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-section">
            <div className="faq-item">
              <h3>Can I return an item without the original packaging?</h3>
              <p>While we prefer items to be returned in original packaging, we understand this isn&apos;t always possible. Contact us to discuss your specific situation.</p>
            </div>
            
            <div className="faq-item">
              <h3>What if I lost my receipt or order confirmation?</h3>
              <p>No problem! We can look up your order using your email address or phone number. Your return will still be processed normally.</p>
            </div>
            
            <div className="faq-item">
              <h3>Can I return a gift?</h3>
              <p>Yes, gifts can be returned for store credit if you don&apos;t have the original order information. The person who purchased the gift can also initiate the return for a full refund.</p>
            </div>
            
            <div className="faq-item">
              <h3>What happens if my return gets lost in shipping?</h3>
              <p>If your return package is lost by the carrier, we&apos;ll work with you to resolve the issue. This is why we recommend using the prepaid labels we provide, which include tracking.</p>
            </div>
          </div>
        </div>

        <div className="returns-section">
          <h2>Contact Us</h2>
          <div className="contact-info">
            <p>Have questions about returning an item? Our customer service team is here to help:</p>
            <div className="contact-methods">
              <div className="contact-method">
                <strong>Phone:</strong> 1-800-GULIME-1 (Available 24/7)
              </div>
              <div className="contact-method">
                <strong>Email:</strong> returns@gulime.com
              </div>
              <div className="contact-method">
                <strong>Live Chat:</strong> Available Monday - Friday, 8 AM - 8 PM EST
              </div>
              <div className="contact-method">
                <strong>Returns Portal:</strong> <a href="/returns-portal">Start your return online</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div></div>
    <Footer/>
    </>
  )
}
