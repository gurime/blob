import Footer from "./Footer";
import Navbar from "./Navbar";
import SecNav from "./SecNav";
import gpremium from '/assets/images/gulimepremium.png'
export default function ShippingInfo() {
  return (
    <>
    <Navbar/>
    <SecNav/>
    <div style={{
  background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 50%, #2c5aa0 100%)'    }}>

  
     <div className="shipping-info-container">
      <div className="shipping-header">
        <h1>Shipping Information</h1>
        <p>Everything you need to know about our shipping policies and delivery options</p>
      </div>

      <div className="shipping-content">
        <div className="shipping-section">
          <h2>Shipping Options & Rates</h2>
          <div className="shipping-options">
            <div className="shipping-option">
              <h3>Standard Shipping</h3>
              <div className="option-details">
                <p><strong>Delivery Time:</strong> 3-4 business days</p>
                <p><strong>Cost:</strong> $5.99 (Free on orders over $35)</p>
                <p><strong>Tracking:</strong> Full tracking provided</p>
              </div>
            </div>
            
            <div className="shipping-option">
           <img style={{width:'224px'}} src={gpremium} alt="..." />
              <div className="option-details">
                <p><strong>Delivery Time:</strong> 1-2 business days</p>
                <p><strong>Cost:</strong> Free</p>
                <p><strong>Tracking:</strong> Full tracking provided</p>
              </div>
            </div>
            
            <div className="shipping-option">
              <h3>Overnight Shipping</h3>
              <div className="option-details">
                <p><strong>Delivery Time:</strong> Next business day</p>
                <p><strong>Cost:</strong> $24.99</p>
                <p><strong>Tracking:</strong> Full tracking provided</p>
              </div>
            </div>
          </div>
        </div>

        <div className="shipping-section">
          <h2>Processing & Handling</h2>
          <div className="processing-info">
            <div className="info-item">
              <h3>Order Processing Time</h3>
              <p>Most orders are processed within 1-2 business days. During peak seasons or sales events, processing may take up to 3-4 business days.</p>
            </div>
            
            <div className="info-item">
              <h3>Cut-off Times</h3>
              <p>Orders placed before 2:00 PM EST on business days will be processed the same day. Orders placed after this time will be processed the next business day.</p>
            </div>
            
            <div className="info-item">
              <h3>Business Days</h3>
              <p>Monday through Friday, excluding federal holidays. Weekend orders will be processed on the next business day.</p>
            </div>
          </div>
        </div>

        <div className="shipping-section">
          <h2>Shipping Destinations</h2>
          <div className="destinations-grid">
            <div className="destination-card">
              <h3>Domestic Shipping</h3>
              <p>We ship to all 50 states within the United States, including Alaska and Hawaii.</p>
              <ul>
                <li>Free standard shipping on orders over $35</li>
                <li>All shipping options available</li>
                <li>Delivery to PO Boxes available</li>
              </ul>
            </div>
            
            <div className="destination-card">
              <h3>International Shipping</h3>
              <p>We currently ship to Canada, Mexico, and select European countries.</p>
              <ul>
                <li>Shipping rates calculated at checkout</li>
                <li>Delivery time: 7-14 business days</li>
                <li>Customs fees may apply</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="shipping-section">
          <h2>Package Tracking</h2>
          <div className="tracking-info">
            <h3>How to Track Your Order</h3>
            <ol>
              <li>Once your order ships, you&apos;ll receive a tracking number via email</li>
              <li>Visit our order tracking page or use the tracking number with the carrier</li>
              <li>Updates are provided in real-time as your package moves through the delivery network</li>
            </ol>
            
            <div className="tracking-tips">
              <h4>Tracking Tips:</h4>
              <ul>
                <li>Allow 24-48 hours for tracking information to appear</li>
                <li>Check your spam folder for tracking emails</li>
                <li>Contact us if you haven&apos;t received tracking info within 2 business days</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="shipping-section">
          <h2>Special Shipping Situations</h2>
          <div className="special-situations">
            <div className="situation-item">
              <h3>Large or Heavy Items</h3>
              <p>Items over 50 lbs or oversized packages may require special handling. Additional shipping charges may apply, and delivery time may be extended.</p>
            </div>
            
            <div className="situation-item">
              <h3>Fragile Items</h3>
              <p>We take extra care with fragile items using specialized packaging. These items are automatically shipped with additional insurance at no extra cost.</p>
            </div>
            
            <div className="situation-item">
              <h3>Multiple Item Orders</h3>
              <p>If your order contains multiple items, they may ship separately. You&apos;ll receive separate tracking numbers for each package.</p>
            </div>
          </div>
        </div>

        <div className="shipping-section">
          <h2>Delivery Issues</h2>
          <div className="delivery-issues">
            <div className="issue-item">
              <h3>Package Not Delivered</h3>
              <p>If your package shows as delivered but you haven&apos;t received it, please check with neighbors and around your property. Contact us within 48 hours if you still can&apos;t locate it.</p>
            </div>
            
            <div className="issue-item">
              <h3>Damaged Packages</h3>
              <p>If your package arrives damaged, please take photos and contact us immediately. We&apos;ll work with the carrier to resolve the issue and send a replacement if needed.</p>
            </div>
            
            <div className="issue-item">
              <h3>Address Changes</h3>
              <p>Once an order has shipped, we cannot change the delivery address. Please ensure your shipping address is correct before completing your order.</p>
            </div>
          </div>
        </div>

        <div className="shipping-section">
          <h2>Contact Information</h2>
          <div className="contact-info">
            <p>For any shipping-related questions or issues, please don&apos;t hesitate to contact our customer service team:</p>
            <div className="contact-methods">
              <div className="contact-method">
                <strong>Phone:</strong> 1-800-GULIME-1 (Available 24/7)
              </div>
              <div className="contact-method">
                <strong>Email:</strong> shipping@gulime.com
              </div>
              <div className="contact-method">
                <strong>Live Chat:</strong> Available Monday - Friday, 8 AM - 8 PM EST
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  
    </div>
    <Footer/>
    </>
  )
}
