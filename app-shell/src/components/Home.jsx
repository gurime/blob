import Navbar from './Navbar';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

export default function Home() {

  const [loading, setLoading] = useState(true);


  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="loading-text">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
 <>
      <Navbar />
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <h1 className="hero-title">Welcome to Our Store</h1>
            <p className="hero-subtitle">
              Discover amazing products at unbeatable prices
            </p>
            <button className="hero-button">Shop Now</button>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="featured-section">
          <div className="container">
            <h2 className="section-title">Featured Products</h2>
            <div className="featured-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} featured={true} />
              ))}
            </div>
          </div>
        </section>

        {/* All Products Section */}
        <section className="products-section">
          <div className="container">
            <h2 className="section-title">All Products</h2>
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}