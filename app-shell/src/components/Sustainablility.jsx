import Footer from "./Footer";
import Navbar from "./Navbar";
import SecNav from "./SecNav";

export default function Sustainablility() {
  return (
    <>
    <Navbar/>
    <SecNav/>
  <div style={{
      background:'linear-gradient(135deg, #4a90e2 0%, #357abd 50%, #2c5aa0 100%)'   
    }}>     {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-icon">🌱</div>
        <h1 className="hero-title">Our Sustainability Commitment</h1>
        <p className="hero-description">
          Building a better future through responsible business practices 
          and environmental stewardship
        </p>
      </div>

      {/* Main Content */}
      <div className="main-container">
        <div className="content-card">
          <h2 className="section-title">Our Green Initiatives</h2>
          
          {/* Three Main Cards */}
          <div className="initiatives-grid">
            {/* Eco-Friendly Packaging */}
            <div className="initiative-card">
              <div className="card-icon">📦</div>
              <h3 className="card-title">Eco-Friendly Packaging</h3>
              <div className="card-content">
                <p><strong>Materials:</strong> 100% recyclable and biodegradable packaging</p>
                <p><strong>Reduction:</strong> 40% less packaging material used</p>
                <p><strong>Innovation:</strong> Plant-based protective materials</p>
              </div>
            </div>

            {/* Carbon Neutral Shipping */}
            <div className="initiative-card premium-card">
              <div className="premium-brand">
                <span className="gulime-text">Gulime</span><span className="green-text">green</span>
              </div>
              <h3 className="card-title">Carbon Neutral Shipping</h3>
              <div className="card-content">
                <p><strong>Offset Program:</strong> 100% carbon neutral delivery</p>
                <p><strong>Green Fleet:</strong> Electric and hybrid vehicles</p>
                <p><strong>Local Hubs:</strong> Reduced transportation distances</p>
              </div>
            </div>

            {/* Waste Reduction */}
            <div className="initiative-card">
              <div className="card-icon">♻️</div>
              <h3 className="card-title">Waste Reduction</h3>
              <div className="card-content">
                <p><strong>Recycling:</strong> Product return and recycling program</p>
                <p><strong>Minimalism:</strong> Zero unnecessary packaging</p>
                <p><strong>Digital:</strong> Electronic receipts and documentation</p>
              </div>
            </div>
          </div>

          {/* Additional Initiatives */}
          <div className="additional-grid">
            {/* Social Responsibility */}
            <div className="additional-card">
              <div className="additional-header">
                <div className="additional-icon">❤️</div>
                <h3 className="additional-title">Social Impact</h3>
              </div>
              <ul className="additional-list">
                <li>• Fair trade partnerships with suppliers</li>
                <li>• Supporting local communities</li>
                <li>• Educational sustainability programs</li>
                <li>• Employee volunteer initiatives</li>
              </ul>
            </div>

            {/* Environmental Goals */}
            <div className="additional-card">
              <div className="additional-header">
                <div className="additional-icon">🌍</div>
                <h3 className="additional-title">2025 Goals</h3>
              </div>
              <ul className="additional-list">
                <li>• 100% renewable energy in warehouses</li>
                <li>• Zero waste to landfill operations</li>
                <li>• 50% reduction in water usage</li>
                <li>• Carbon negative by 2030</li>
              </ul>
            </div>
          </div>

          {/* Certifications */}
          <div className="certifications-section">
            <div className="cert-icon">🏆</div>
            <h3 className="cert-title">Our Certifications</h3>
            <div className="cert-badges">
              <div className="cert-badge cert-green">B-Corp Certified</div>
              <div className="cert-badge cert-blue">Carbon Trust Standard</div>
              <div className="cert-badge cert-yellow">ISO 14001</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="cta-section">
            <h3 className="cta-title">Join Us in Making a Difference</h3>
            <p className="cta-description">
              Every purchase supports our mission to create a more sustainable future. 
              Together, we can make a positive impact on our planet.
            </p>
            <button className="cta-button">Learn More About Our Impact</button>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}
