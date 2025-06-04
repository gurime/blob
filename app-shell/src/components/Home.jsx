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
    // console.log(productsList);
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
  
        {/* Featured Products Section */}
        <section className="featured-products">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <div key={product._id} className="product-card">
                    <img src={`/assets/images/${product.imgUrl}`} alt={product.product_name} />
                <h3>{product.product_name}</h3>
                <p>${product.price}</p>
                <p>{product.category}</p>
              </div>
            ))}
          </div>
        </section>
{products.map(product => (
<div key={product.id} className="products-card">
  <h2>{product.product_name}</h2>
    <h3>{product.category}</h3>

  <p>{product.description}</p>
  <p>${product.price}</p>
    <img src={`/assets/images/${product.imgUrl}`} alt={product.product_name} />
    <Link to={`/product/${product.collection}/${product._id}`}>
    View Details
</Link>
    </div>
    
))}

<Footer />
</>
);
}