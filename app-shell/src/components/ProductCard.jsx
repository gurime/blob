
// Product Card Component
function ProductCard({ product, featured = false }) {
  return (
    <div className={`product-card ${featured ? 'featured' : ''}`}>
      {featured && (
        <div className="featured-badge">FEATURED</div>
      )}
      <div className="product-content">
        <img
          src={product.img_url || '/placeholder-image.jpg'}
          alt={product.product_name}
          className="product-image"
        />
        <h3 className="product-name">{product.product_name}</h3>
        <p className="product-category">{product.category}</p>
        <div className="product-footer">
          <span className="product-price">
            ${product.price.toFixed(2)}
          </span>
          <button className="add-to-cart-btn">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;