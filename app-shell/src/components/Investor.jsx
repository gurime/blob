import Footer from "./Footer";
import Navbar from "./Navbar";
import SecNav from "./SecNav";
export default function Investor() {
  return (
    <>
    <Navbar/>
    <SecNav/>
       
      <div className="investor-container">
        <div className="investor-hero-section">
          <h1 className="investor-hero-title">Invest in the Future</h1>
          <p className="investor-hero-subtitle">
            Join us in revolutionizing e-commerce. From everyday essentials to luxury automobiles,
            Gulime is building the next generation marketplace that connects millions of customers
            with quality products and exceptional service.
          </p>
        </div>

        <div className="investor-main-content">
          <div className="investor-content-wrapper">
            
            {/* Key Metrics */}
            <div className="investor-stats-grid">
              <div className="investor-stat-card">
                <div className="investor-stat-number">$2.3M</div>
                <div className="investor-stat-label">Monthly Revenue</div>
              </div>
              <div className="investor-stat-card">
                <div className="investor-stat-number">145K+</div>
                <div className="investor-stat-label">Active Customers</div>
              </div>
              <div className="investor-stat-card">
                <div className="investor-stat-number">89%</div>
                <div className="investor-stat-label">Customer Satisfaction</div>
              </div>
              <div className="investor-stat-card">
                <div className="investor-stat-number">12</div>
                <div className="investor-stat-label">Product Categories</div>
              </div>
            </div>

            {/* Company Overview */}
            <div className="investor-section">
              <h2 className="investor-section-title">Why Gulime?</h2>
              <div className="investor-section-content">
                Gulime Premium represents a unique opportunity in the rapidly expanding e-commerce sector. 
                Our platform serves as a comprehensive marketplace offering everything from consumer electronics 
                to high-value automotive products, positioning us at the intersection of multiple billion-dollar markets.
              </div>
              
              <div className="investor-highlights-grid">
                <div className="investor-highlight-card">
                  <h3 className="investor-highlight-title">Market Expansion</h3>
                  <p className="investor-highlight-text">
                    Rapid growth across diverse product categories with particular strength in 
                    electronics, automotive, and premium consumer goods.
                  </p>
                </div>
                <div className="investor-highlight-card">
                  <h3 className="investor-highlight-title">Technology Platform</h3>
                  <p className="investor-highlight-text">
                    Proprietary e-commerce infrastructure designed for scalability, 
                    supporting everything from small accessories to large vehicle transactions.
                  </p>
                </div>
                <div className="investor-highlight-card">
                  <h3 className="investor-highlight-title">Customer Experience</h3>
                  <p className="investor-highlight-text">
                    Premium service model with personalized recommendations, 
                    white-glove delivery options, and dedicated customer success teams.
                  </p>
                </div>
              </div>
            </div>

            {/* Growth Timeline */}
            <div className="investor-section">
              <h2 className="investor-section-title">Our Growth Story</h2>
              <div className="investor-timeline">
                <div className="investor-timeline-item">
                  <div className="investor-timeline-year">2024</div>
                  <div className="investor-timeline-text">
                    Platform launch with focus on electronics and consumer goods. 
                    Achieved $500K in first-quarter revenue.
                  </div>
                </div>
                <div className="investor-timeline-item">
                  <div className="investor-timeline-year">Early 2025</div>
                  <div className="investor-timeline-text">
                    Expanded into automotive marketplace, partnering with dealerships 
                    and private sellers. Customer base grew to 50K active users.
                  </div>
                </div>
                <div className="investor-timeline-item">
                  <div className="investor-timeline-year">Mid 2025</div>
                  <div className="investor-timeline-text">
                    Launched premium subscription service and mobile app. 
                    Monthly revenue reached $2.3M with 145K+ active customers.
                  </div>
                </div>
                <div className="investor-timeline-item">
                  <div className="investor-timeline-year">2025 - Present</div>
                  <div className="investor-timeline-text">
                    Seeking Series A funding to accelerate expansion into new markets 
                    and enhance our technology platform.
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Opportunity */}
            <div className="investor-section">
              <h2 className="investor-section-title">Investment Opportunity</h2>
              <div className="investor-section-content">
                We are currently raising a Series A round to fuel our next phase of growth. 
                This funding will enable us to expand our market reach, enhance our technology platform, 
                and build strategic partnerships that will solidify our position as a leader in 
                diversified e-commerce.
              </div>
              
              <div className="investor-highlights-grid">
                <div className="investor-highlight-card">
                  <h3 className="investor-highlight-title">Market Expansion</h3>
                  <p className="investor-highlight-text">
                    Geographic expansion into new regions and international markets, 
                    with focus on high-growth areas.
                  </p>
                </div>
                <div className="investor-highlight-card">
                  <h3 className="investor-highlight-title">Technology Investment</h3>
                  <p className="investor-highlight-text">
                    AI-powered recommendation engine, advanced logistics optimization, 
                    and enhanced mobile experience.
                  </p>
                </div>
                <div className="investor-highlight-card">
                  <h3 className="investor-highlight-title">Strategic Partnerships</h3>
                  <p className="investor-highlight-text">
                    Building relationships with major brands and manufacturers 
                    to expand our premium product offerings.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="investor-cta-section">
              <h2 className="investor-cta-title">Ready to Join Our Journey?</h2>
              <p className="investor-cta-text">
                Connect with our team to learn more about investment opportunities 
                and how you can be part of Gulime&apos;s growth story.
              </p>
              <button className="investor-cta-button">Contact Our Investment Team</button>
            </div>

          </div>
        </div>
      </div>
      
    <Footer/>
    </>
  )
}
