import Footer from "./Footer";
import Navbar from "./Navbar";
import SecNav from "./SecNav";

const careersData = [
  {
    title: "Frontend Developer",
    icon: "💻",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "0-2 years",
    description:
      "Join our frontend team to build responsive, user-friendly interfaces for our ecommerce platform. Work with React, Next.js, and modern web technologies to create seamless shopping experiences.",
  },
  {
    title: "Product Manager",
    icon: "📊",
    department: "Product",
    location: "Atlanta, GA",
    type: "Full-time",
    experience: "3-5 years",
    description:
      "Drive product strategy and roadmap for our automotive marketplace. Collaborate with engineering, design, and business teams to deliver features that delight customers and drive growth.",
  },
  {
    title: "Customer Success Manager",
    icon: "🤝",
    department: "Customer Success",
    location: "Atlanta, GA",
    type: "Full-time",
    experience: "1-2 years",
    description:
      "Help our merchants succeed on the Gulime platform. Build relationships, provide strategic guidance, and ensure customer satisfaction while driving retention and growth.",
  },
  {
    title: "Data Analyst",
    icon: "📈",
    department: "Analytics",
    location: "Remote",
    type: "Full-time",
    experience: "1-3 years",
    description:
      "Transform data into actionable insights that drive business decisions. Work with large datasets to understand customer behavior, market trends, and optimize our platform performance.",
  },
  {
    title: "DevOps Engineer",
    icon: "⚙️",
    department: "Infrastructure",
    location: "Atlanta, GA",
    type: "Full-time",
    experience: "3-5 years",
    description:
      "Build and maintain scalable infrastructure that supports millions of transactions. Work with AWS, Kubernetes, and CI/CD pipelines to ensure reliable platform operations.",
  },
  {
    title: "UX Designer",
    icon: "🎨",
    department: "Design",
    location: "Atlanta, GA",
    type: "Full-time",
    experience: "0-2 years",
    description:
      "Create intuitive, beautiful user experiences across our platform. Conduct user research, design wireframes and prototypes, and collaborate with product teams to solve complex UX challenges.",
  },
  {
    title: "Logistics Coordinator",
    icon: "📦",
    department: "Operations",
    location: "Atlanta, GA",
    type: "Full-time",
    experience: "2-4 years",
    description:
      "Manage order fulfillment, shipping schedules, and inventory logistics across warehouses. Ensure timely deliveries and efficient supply chain operations.",
  },
  {
    title: "Digital Marketing Specialist",
    icon: "📣",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    experience: "2-3 years",
    description:
      "Plan and manage digital ad campaigns on Google, Meta, TikTok, and more. Drive growth through data-driven performance marketing strategies.",
  },
  {
    title: "Ecommerce Merchandiser",
    icon: "🛒",
    department: "Marketing / Merchandising",
    location: "Remote",
    type: "Full-time",
    experience: "1-3 years",
    description:
      "Curate and optimize product listings. Collaborate with teams to create high-converting product detail pages that enhance the shopping experience.",
  },
  {
    title: "Accounts Payable Specialist",
    icon: "🧾",
    department: "Finance",
    location: "Atlanta, GA",
    type: "Full-time",
    experience: "1-2 years",
    description:
      "Handle vendor invoices, ensure accurate payment processing, and maintain financial records in compliance with accounting standards.",
  },
  {
    title: "Privacy & Compliance Analyst",
    icon: "🔒",
    department: "Legal / Compliance",
    location: "Remote",
    type: "Full-time",
    experience: "2-5 years",
    description:
      "Monitor compliance with data privacy laws like GDPR and CCPA. Audit systems and update internal policies to protect user data.",
  },
  {
    title: "Mobile App Developer",
    icon: "📱",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "1-3 years",
    description:
      "Build and maintain our ecommerce mobile app using React Native or Flutter. Ensure high performance and seamless user experience on iOS and Android.",
  },
  {
    title: "AI/ML Engineer",
    icon: "🧠",
    department: "Engineering / Data Science",
    location: "Remote",
    type: "Full-time",
    experience: "3-5 years",
    description:
      "Develop recommendation systems, fraud detection, and forecasting models. Use Python, TensorFlow, and real-time data to improve personalization.",
  },
  {
    title: "Customer Support Specialist",
    icon: "🎧",
    department: "Customer Support",
    location: "Remote",
    type: "Full-time",
    experience: "Entry-level",
    description:
      "Provide fast and friendly assistance to customers via chat, email, and phone. Resolve issues and help improve the overall support experience.",
  },
  {
    title: "Content Strategist",
    icon: "✍️",
    department: "Marketing / Content",
    location: "Remote",
    type: "Full-time",
    experience: "2+ years",
    description:
      "Plan and create SEO-friendly content for product pages, blogs, and email campaigns. Work with design and marketing to ensure consistent messaging.",
  },
  {
    title: "Marketplace Operations Manager",
    icon: "🛍️",
    department: "Seller Success",
    location: "Atlanta, GA",
    type: "Full-time",
    experience: "3+ years",
    description:
      "Lead seller onboarding and performance management. Ensure a healthy, competitive marketplace that benefits both merchants and customers.",
  }
];

export default function Careers() {
  return (
    <>
       <Navbar />
      <SecNav />

      {/* Hero Section */}
      <section className="careers-hero">
        <div className="careers-icon">💼</div>
        <div className="careers-hero-content">
          <h1>Join Our Team</h1>
          <p>
            Build your career with Gulime - where innovation meets opportunity. Help us revolutionize
            ecommerce and create amazing experiences for millions of customers.
          </p>
        </div>
      </section>

      {/* Open Positions */}
      <section className="careers-main">
        <div className="careers-container">
          <h2 className="careers-section-title">Open Positions</h2>
          <div className="careers-grid">
            {careersData.map((job, index) => (
              <div className="career-card" key={index}>
                <span className="career-icon">{job.icon}</span>
                <h3>{job.title}</h3>
                <div className="career-details">
                  <div className="career-detail">
                    <strong>Department:</strong> {job.department}
                  </div>
                  <div className="career-detail">
                    <strong>Location:</strong> {job.location}
                  </div>
                  <div className="career-detail">
                    <strong>Type:</strong> {job.type}
                  </div>
                  <div className="career-detail">
                    <strong>Experience:</strong> {job.experience}
                  </div>
                </div>
                <p className="career-description">{job.description}</p>
                <button className="apply-btn">Apply Now</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="careers-container">
          <h2 className="careers-section-title">Why Work With Us?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <span className="benefit-icon">🏥</span>
              <h4>Health & Wellness</h4>
              <p>Comprehensive health insurance, dental, vision, and mental health support for you and your family.</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🌴</span>
              <h4>Flexible Time Off</h4>
              <p>Unlimited PTO policy and flexible working hours to maintain your work-life balance.</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">💰</span>
              <h4>Competitive Compensation</h4>
              <p>Market-leading salaries, equity packages, and performance bonuses to reward your contributions.</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🏠</span>
              <h4>Remote First</h4>
              <p>Work from anywhere with our remote-first culture and home office setup stipend.</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">📚</span>
              <h4>Learning & Development</h4>
              <p>Annual learning budget, conference attendance, and mentorship programs for continuous growth.</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🚗</span>
              <h4>Transportation Benefits</h4>
              <p>Commuter benefits, parking stipends, and special discounts on vehicles through our platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="careers-container">
          <div className="cta-content">
            <h2>Ready to Join Gulime?</h2>
            <p>Don&apos;t see a role that fits? We&apos;re always looking for talented individuals to join our growing team.</p>
            <a href="mailto:careers@gulime.com" className="cta-btn">Send Us Your Resume</a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
