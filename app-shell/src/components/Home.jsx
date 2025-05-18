import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    product_name: '',
    price: '',
    category: '',
    img_url: ''
  });

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products');
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle input changes for the new product form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    }));
  };

  // Handle form submission to create new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/products', newProduct);
      setProducts(prev => [...prev, response.data]);
      // Reset form
      setNewProduct({
        product_name: '',
        price: '',
        category: '',
        img_url: ''
      });
    } catch (err) {
      setError('Failed to add product. Please try again.');
      console.error('Error adding product:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="page-title">Product Catalog</h1>
        
        {/* Add Product Form */}
        <div className="form-container">
          <h2 className="form-title">Add New Product</h2>
          {error && <p className="error-message">{error}</p>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="product_name" className="form-label">Product Name</label>
              <input
                type="text"
                id="product_name"
                name="product_name"
                value={newProduct.product_name}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="price" className="form-label">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category" className="form-label">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="img_url" className="form-label">Image URL</label>
              <input
                type="url"
                id="img_url"
                name="img_url"
                value={newProduct.img_url}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
            >
              Add Product
            </button>
          </form>
        </div>
        
        {/* Product List */}
        {comments.name}
        {/* <div>
          <h2 className="products-title">Products</h2>
          
          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products available yet.</p>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <div key={product._id} className="product-card">
                  {product.img_url ? (
                    <img 
                      src={product.img_url} 
                      alt={product.product_name}
                      className="product-image"
                    />
                  ) : (
                    <div className="image-placeholder">
                      <span>No image available</span>
                    </div>
                  )}
                  
                  <div className="product-details">
                    <h3 className="product-name">{product.product_name}</h3>
                    <p className="product-price">${product.price.toFixed(2)}</p>
                    <p className="product-category">Category: {product.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div> */}
      </div>
      <Footer />
    </>
  );
}