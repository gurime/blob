import Navbar from './Navbar';
import Footer from './Footer';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  return (
    <>
      <Navbar />
      <h1>Home</h1>
      <ul>
        {products.map((product, index) => (
          <li key={index}>{product.product_name}</li>
        ))}
      </ul>
      <Footer />
    </>
  );
}
