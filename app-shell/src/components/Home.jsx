import Navbar from './Navbar';
import Footer from './Footer';
import {getDocs, collection } from 'firebase/firestore';
import { db } from '../db/firebase';
import { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { Link } from 'react-router-dom';
export default function Home() {
  const [products, setProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);

const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchFeaturedProducts = async () => {
    try {
 await getDocs(collection(db, 'featuredProducts'));
      const querySnapshot = await getDocs(collection(db, 'featuredProducts'));
      const fetaureProductList = querySnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
      setFeaturedProducts(fetaureProductList);
    } catch (error) {
setError(error.message);
    }
    finally {
      setLoading(false);
    }
  };

  fetchFeaturedProducts();
}
, []);

useEffect(() => {
  const fetchData = async () => {
  try {
await getDocs(collection(db, 'products'));
    const querySnapshot = await getDocs(collection(db, 'products'));
    const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(productsList);
  } catch (error) {
    setError(error.message);
  }
  finally {
    setLoading(false);
  }
}

  fetchData();
}, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading"> 
        <ClipLoader size={50} color="#2637be"/>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="error-message ">Error: {error}</div>
        <Footer />
      </>
    );
  }
 
return (
<>
<Navbar />
  
 <div className="container">
      {/* Featured Products Section */}
      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <div key={product._id} className="product-card">
              <img src={`/assets/images/${product.imgUrl}`} alt={product.product_name} />
              <div className="product-info">
                <h3>{product.product_name}</h3>
                <p className="product-price">${product.price}</p>
                <p className="product-category">{product.category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Products Section */}
      <section >
        <h2>All Products</h2>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="products-card">
              <h2>{product.product_name}</h2>
              <h3>{product.category}</h3>
              <p>{product.description}</p>
              <p className="product-price">${product.price}</p>
              <img src={`/assets/images/${product.imgUrl}`} alt={product.product_name} />
              <Link to={`/product/${encodeURIComponent(product.product_name)}`} className="view-details">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>


<Footer />
</>
);
}