import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import SecNav from "./SecNav";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../db/firebase";

export default function Press() {
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'blogs'));
        const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBlog(productsList);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);



  const navigate = useNavigate();

  // Combine and sort all content by date
  const getAllContent = () => {
    const allContent = [];
    
    // Add Firebase blogs
    if (blog) {
      blog.forEach(post => {
        allContent.push({
          ...post,
          source: 'firebase',
          featured: post.featured || false
        });
      });
    }
    
    // Add hardcoded press releases
 
    // Sort by date (newest first)
    return allContent.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const allContent = getAllContent();
  const featuredContent = allContent.filter(item => item.featured);
  const regularContent = allContent.filter(item => !item.featured);

  return (
    <>
      <Navbar/>
      <SecNav/>
      
      <div className="press-container">
        {/* Hero Section */}
        <section className="press-hero">
          <div className="press-hero-content">
            <h1 className="press-hero-title">Press & Media</h1>
            <p className="press-hero-subtitle">
              Stay updated with the latest news, announcements, and milestones from Gulime
            </p>
          </div>
        </section>

        {/* Loading and Error States */}
        {loading && (
          <section className="press-loading">
            <div className="press-content-wrapper">
              <div className="loading-message">Loading latest content...</div>
            </div>
          </section>
        )}

        {error && (
          <section className="press-error">
            <div className="press-content-wrapper">
              <div className="error-message">Error loading content: {error}</div>
            </div>
          </section>
        )}

        {/* Featured Content Section */}
        {!loading && featuredContent.length > 0 && (
          <section className="press-featured-section">
            <div className="press-content-wrapper">
              <h2 className="press-section-title">Latest News</h2>
              {featuredContent.map(item => (
                <article key={`featured-${item.source}-${item.id}`} className="press-featured-card">
                  <div className="press-featured-header">
                    <span className="press-category press-category-featured">
                      {item.category || 'News'}
                    </span>
                    <time className="press-date">{item.date || 'No date'}</time>
                  </div>
                  <h3 className="press-featured-title">{item.title}</h3>
                  <p className="press-featured-excerpt">
                    {item.excerpt || 'No excerpt available'}
                  </p>
                  <div className="press-featured-content">
                    <p>{item.content || item.description || 'No content available'}</p>
                  </div>
                  <button 
                    className="press-read-more"   
                    onClick={() => navigate(`/blog/${item.id}`)}
                  >
                    Read Full {item.source === 'firebase' ? 'Post' : 'Release'}
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* All Content Grid */}
        {!loading && (
          <section className="press-releases-section">
            <div className="press-content-wrapper">
              <h2 className="press-section-title">
                {blog && blog.length > 0 ? 'Recent Posts & Press Releases' : 'Recent Press Releases'}
              </h2>
              
              {regularContent.length > 0 ? (
                <div className="press-releases-grid">
                  {regularContent.map(item => (
                    <article key={`regular-${item.source}-${item.id}`} className="press-release-card">
                      <div className="press-card-header">
                        <span className="press-category">
                          {item.category || (item.source === 'firebase' ? 'Blog' : 'News')}
                        </span>
                        <time className="press-date">{item.date || 'No date'}</time>
                      </div>
                      <h3 className="press-card-title">{item.title}</h3>
                      <p className="press-card-excerpt">
                        {item.excerpt 
                          ? (item.excerpt.length > 100 ? item.excerpt.slice(0,100) + '...' : item.excerpt)
                          : 'No excerpt available'
                        }
                      </p>
                      <button 
                        className="press-card-link"
                        onClick={() => navigate(`/blog/${item.id}`)}
                      >
                        Read More
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="no-content">No content available at this time.</div>
              )}
            </div>
          </section>
        )}

        {/* Media Kit Section */}
        <section className="press-media-kit">
          <div className="press-content-wrapper">
            <div className="press-media-kit-content">
              <h2 className="press-section-title">Media Resources</h2>
              <p className="press-media-kit-description">
                Download our media kit for logos, product images, and company information
              </p>
              <div className="press-media-kit-actions">
                <button className="press-media-kit-button">Download Media Kit</button>
                <button className="press-media-kit-button press-media-kit-secondary">
                  Company Fact Sheet
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="press-contact-section">
          <div className="press-content-wrapper">
            <div className="press-contact-content">
              <h2 className="press-section-title">Media Contact</h2>
              <div className="press-contact-info">
                <div className="press-contact-item">
                  <h4>Press Inquiries</h4>
                  <p>press@gulime.com</p>
                </div>
                <div className="press-contact-item">
                  <h4>Partnership Opportunities</h4>
                  <p>partnerships@gulime.com</p>
                </div>
                <div className="press-contact-item">
                  <h4>General Information</h4>
                  <p>info@gulime.com</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer/>
    </>
  )
}
