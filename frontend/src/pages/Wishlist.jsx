import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist, addToCart } from '../services/api';
import { toast } from 'react-toastify';
import { FiHeart, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import './Wishlist.css';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWishlist()
      .then(({ data }) => setItems(data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (wishlistId) => {
    try {
      await removeFromWishlist(wishlistId);
      setItems((prev) => prev.filter((item) => item.wishlist_id !== wishlistId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const handleMoveToCart = async (item) => {
    try {
      await addToCart(item.id, 1);
      await removeFromWishlist(item.wishlist_id);
      setItems((prev) => prev.filter((i) => i.wishlist_id !== item.wishlist_id));
      toast.success('Moved to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to move to cart');
    }
  };

  if (loading) {
    return (
      <div className="wishlist-page container fade-in">
        <h2 className="wishlist-title">My Wishlist</h2>
        <div className="wishlist-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 280, borderRadius: 8 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page container fade-in">
      <h2 className="wishlist-title">My Wishlist ({items.length} items)</h2>

      {items.length === 0 ? (
        <div className="wishlist-empty">
          <FiHeart size={64} className="wishlist-empty-icon" />
          <h3>Your wishlist is empty!</h3>
          <p>Save items you love to your wishlist for later</p>
          <Link to="/products" className="btn-primary">Explore Products</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {items.map((item) => (
            <div key={item.wishlist_id} className="wishlist-card slide-up">
              <Link to={`/product/${item.id}`} className="wishlist-card-image-wrap">
                <img
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/images/proxy?url=${encodeURIComponent(item.image || `https://via.placeholder.com/200x200?text=${encodeURIComponent(item.name)}`)}`}
                  alt={item.name}
                  className="wishlist-card-image"
                />
              </Link>
              <div className="wishlist-card-info">
                <Link to={`/product/${item.id}`} className="wishlist-card-name">{item.name}</Link>
                <div className="wishlist-card-price">₹{Number(item.price).toLocaleString('en-IN')}</div>
              </div>
              <div className="wishlist-card-actions">
                <button className="wishlist-move-btn" onClick={() => handleMoveToCart(item)}>
                  <FiShoppingCart size={14} /> Move to Cart
                </button>
                <button className="wishlist-remove-btn" onClick={() => handleRemove(item.wishlist_id)}>
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
