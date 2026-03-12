import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartQty, removeFromCart, placeOrder } from '../services/api';
import { toast } from 'react-toastify';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiMapPin } from 'react-icons/fi';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [placing, setPlacing] = useState(false);

  const fetchCart = () => {
    setLoading(true);
    getCart()
      .then(({ data }) => setCartItems(data || []))
      .catch(() => setCartItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQty = async (cartItemId, newQty) => {
    if (newQty < 1) return;
    try {
      await updateCartQty(cartItemId, newQty);
      setCartItems((prev) =>
        prev.map((item) =>
          item.cart_item_id === cartItemId ? { ...item, quantity: newQty } : item
        )
      );
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      setCartItems((prev) => prev.filter((item) => item.cart_item_id !== cartItemId));
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) return toast.warn('Please enter a shipping address');
    setPlacing(true);
    try {
      const { data } = await placeOrder(shippingAddress);
      toast.success(`Order placed! ID: ${data.orderId}`);
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="cart-page container fade-in">
        <h2 className="cart-title">My Cart</h2>
        <div className="cart-layout">
          <div className="cart-items">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 120, borderRadius: 8, marginBottom: 8 }} />
            ))}
          </div>
          <div className="skeleton" style={{ height: 200, borderRadius: 8 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container fade-in">
      <h2 className="cart-title">My Cart ({totalItems} items)</h2>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <FiShoppingBag size={64} className="cart-empty-icon" />
          <h3>Your cart is empty!</h3>
          <p>Add items to your cart from the product pages</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.cart_item_id} className="cart-item slide-up">
                <Link to={`/product/${item.id}`} className="cart-item-image-wrap">
                <img
                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/images/proxy?url=${encodeURIComponent(item.image || `https://via.placeholder.com/200x200?text=${encodeURIComponent(item.name)}`)}`}
                    alt={item.name}
                    className="cart-item-image"
                  />
                </Link>
                <div className="cart-item-info">
                  <Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link>
                  <div className="cart-item-price">₹{Number(item.price).toLocaleString('en-IN')}</div>
                  <div className="cart-item-controls">
                    <div className="cart-qty-controls">
                      <button
                        className="cart-qty-btn"
                        onClick={() => handleUpdateQty(item.cart_item_id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => handleUpdateQty(item.cart_item_id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <button
                      className="cart-remove-btn"
                      onClick={() => handleRemove(item.cart_item_id)}
                    >
                      <FiTrash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
                <div className="cart-item-subtotal">
                  ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h3 className="cart-summary-title">PRICE DETAILS</h3>
            <div className="cart-summary-row">
              <span>Price ({totalItems} items)</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="cart-summary-row">
              <span>Delivery Charges</span>
              <span className="cart-free">FREE</span>
            </div>
            <div className="cart-summary-total">
              <span>Total Amount</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            {!showCheckout ? (
              <button
                className="btn-primary cart-checkout-btn"
                onClick={() => setShowCheckout(true)}
              >
                Place Order
              </button>
            ) : (
              <form onSubmit={handlePlaceOrder} className="cart-checkout-form scale-in">
                <div className="cart-address-group">
                  <FiMapPin size={16} className="cart-address-icon" />
                  <input
                    type="text"
                    placeholder="Enter shipping address..."
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="cart-address-input"
                    id="shipping-address"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary cart-checkout-btn" disabled={placing}>
                  {placing ? 'Placing Order...' : 'Confirm Order'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
