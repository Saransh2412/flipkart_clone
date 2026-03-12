import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, addToCart, addToWishlist } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiShoppingCart, FiHeart, FiChevronRight, FiCheck, FiX } from 'react-icons/fi';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(({ data }) => setProduct(data))
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) return toast.info('Please login to add items to cart');
    try {
      await addToCart(product.id, quantity);
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) return toast.info('Please login to add items to wishlist');
    try {
      await addToWishlist(product.id);
      toast.success('Added to wishlist!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page container fade-in">
        <div className="pd-grid">
          <div className="skeleton" style={{ height: 450, borderRadius: 8 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="skeleton" style={{ height: 32, width: '80%', borderRadius: 4 }} />
            <div className="skeleton" style={{ height: 40, width: '40%', borderRadius: 4 }} />
            <div className="skeleton" style={{ height: 100, borderRadius: 4 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page container">
        <div className="pd-not-found">
          <h2>Product not found</h2>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  const rawImages = product.images?.length > 0
    ? product.images
    : [`https://via.placeholder.com/500x500?text=${encodeURIComponent(product.name)}`];

  const images = rawImages.map(img => `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/images/proxy?url=${encodeURIComponent(img)}`);

  const discount = Math.floor(Math.random() * 30) + 10;
  const originalPrice = (product.price / (1 - discount / 100)).toFixed(2);

  return (
    <div className="product-detail-page container fade-in">
      {/* Breadcrumb */}
      <div className="pd-breadcrumb">
        <Link to="/">Home</Link>
        <FiChevronRight size={14} />
        <Link to="/products">Products</Link>
        <FiChevronRight size={14} />
        {product.category_name && (
          <>
            <Link to={`/products?category=${encodeURIComponent(product.category_name)}`}>
              {product.category_name}
            </Link>
            <FiChevronRight size={14} />
          </>
        )}
        <span>{product.name}</span>
      </div>

      <div className="pd-grid">
        {/* Image Gallery */}
        <div className="pd-images">
          <div className="pd-main-image-wrap">
            <img src={images[selectedImage]} alt={product.name} className="pd-main-image" />
          </div>
          {images.length > 1 && (
            <div className="pd-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`pd-thumb ${i === selectedImage ? 'active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
          <div className="pd-actions-mobile">
            <button className="btn-primary pd-action-btn" onClick={handleAddToCart}>
              <FiShoppingCart size={18} /> Add to Cart
            </button>
            <button className="btn-secondary pd-action-btn" onClick={handleAddToWishlist}>
              <FiHeart size={18} /> Wishlist
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="pd-info">
          <h1 className="pd-name">{product.name}</h1>
          {product.category_name && (
            <span className="pd-category-badge">{product.category_name}</span>
          )}

          <div className="pd-pricing">
            <span className="pd-price">₹{Number(product.price).toLocaleString('en-IN')}</span>
            <span className="pd-original-price">₹{Number(originalPrice).toLocaleString('en-IN')}</span>
            <span className="pd-discount">{discount}% off</span>
          </div>

          <div className="pd-stock">
            {product.stock > 0 ? (
              <span className="pd-in-stock"><FiCheck size={14} /> In Stock ({product.stock} available)</span>
            ) : (
              <span className="pd-out-of-stock"><FiX size={14} /> Out of Stock</span>
            )}
          </div>

          <div className="pd-description">
            <h3>Description</h3>
            <p>{product.description || 'No description available for this product.'}</p>
          </div>

          {product.stock > 0 && (
            <div className="pd-quantity">
              <label>Quantity:</label>
              <div className="pd-qty-controls">
                <button
                  className="pd-qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >−</button>
                <span className="pd-qty-value">{quantity}</span>
                <button
                  className="pd-qty-btn"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >+</button>
              </div>
            </div>
          )}

          <div className="pd-actions">
            <button className="btn-primary pd-action-btn" onClick={handleAddToCart} disabled={product.stock <= 0}>
              <FiShoppingCart size={18} /> Add to Cart
            </button>
            <button className="btn-secondary pd-action-btn" onClick={handleAddToWishlist}>
              <FiHeart size={18} /> Wishlist
            </button>
          </div>

          {/* Highlights */}
          <div className="pd-highlights">
            <div className="pd-highlight">
              <span className="pd-highlight-icon">🚚</span>
              <div>
                <strong>Free Delivery</strong>
                <span>On orders above ₹499</span>
              </div>
            </div>
            <div className="pd-highlight">
              <span className="pd-highlight-icon">🔄</span>
              <div>
                <strong>7 Day Returns</strong>
                <span>Return within 7 days</span>
              </div>
            </div>
            <div className="pd-highlight">
              <span className="pd-highlight-icon">✅</span>
              <div>
                <strong>Genuine Product</strong>
                <span>100% authentic</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
