import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { addToCart, addToWishlist } from '../services/api';
import { toast } from 'react-toastify';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { user } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(product.id, 1);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info('Please login to add items to wishlist');
      return;
    }
    try {
      await addToWishlist(product.id);
      toast.success('Added to wishlist!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  const rawImageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop';
  
  const imageUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/images/proxy?url=${encodeURIComponent(rawImageUrl)}`;

  const discount = Math.floor(Math.random() * 30) + 10;
  const originalPrice = (product.price / (1 - discount / 100)).toFixed(2);

  return (
    <Link to={`/product/${product.id}`} className="product-card" id={`product-${product.id}`}>
      <div className="product-card-image-wrap">
        <img src={imageUrl} alt={product.name} className="product-card-image" loading="lazy" />
        <button
          className="product-card-wishlist-btn"
          onClick={handleAddToWishlist}
          title="Add to Wishlist"
        >
          <FiHeart size={16} />
        </button>
      </div>
      <div className="product-card-info">
        <h3 className="product-card-title">{product.name}</h3>
        <div className="product-card-category">{product.category_name}</div>
        <div className="product-card-pricing">
          <span className="product-card-price">₹{Number(product.price).toLocaleString('en-IN')}</span>
          <span className="product-card-original-price">₹{Number(originalPrice).toLocaleString('en-IN')}</span>
          <span className="product-card-discount">{discount}% off</span>
        </div>
        <div className="product-card-stock">
          {product.stock > 0 ? (
            <span className="in-stock">In Stock</span>
          ) : (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>
      </div>
      <button className="product-card-cart-btn" onClick={handleAddToCart}>
        <FiShoppingCart size={14} /> Add to Cart
      </button>
    </Link>
  );
}
