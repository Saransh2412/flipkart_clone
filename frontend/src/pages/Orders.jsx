import { useState, useEffect } from 'react';
import { getOrders, getOrderById } from '../services/api';
import { toast } from 'react-toastify';
import { FiPackage, FiChevronDown, FiChevronUp, FiClock, FiCheckCircle } from 'react-icons/fi';
import './Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});

  useEffect(() => {
    getOrders()
      .then(({ data }) => setOrders(data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleOrder = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }

    setExpandedOrder(orderId);

    if (!orderDetails[orderId]) {
      try {
        const { data } = await getOrderById(orderId);
        setOrderDetails((prev) => ({ ...prev, [orderId]: data }));
      } catch (err) {
        toast.error('Failed to load order details');
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <FiCheckCircle size={16} className="status-delivered" />;
      default:
        return <FiClock size={16} className="status-pending" />;
    }
  };

  if (loading) {
    return (
      <div className="orders-page container fade-in">
        <h2 className="orders-title">My Orders</h2>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 80, borderRadius: 8, marginBottom: 8 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="orders-page container fade-in">
      <h2 className="orders-title">My Orders</h2>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <FiPackage size={64} className="orders-empty-icon" />
          <h3>No orders yet!</h3>
          <p>Your order history will appear here</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card slide-up">
              <button
                className="order-card-header"
                onClick={() => handleToggleOrder(order.id)}
              >
                <div className="order-card-left">
                  <div className="order-id">
                    <FiPackage size={18} />
                    <span>{order.id}</span>
                  </div>
                  <div className="order-date">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                <div className="order-card-right">
                  <div className="order-status">
                    {getStatusIcon(order.status)}
                    <span className={`status-text ${order.status?.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-total">₹{Number(order.total_price).toLocaleString('en-IN')}</div>
                  {expandedOrder === order.id ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                </div>
              </button>

              {expandedOrder === order.id && (
                <div className="order-details scale-in">
                  {orderDetails[order.id] ? (
                    <>
                      <div className="order-detail-address">
                        <strong>Shipping Address:</strong>
                        <span>{orderDetails[order.id].shipping_address}</span>
                      </div>
                      <div className="order-items-list">
                        <div className="order-items-header">
                          <span>Product</span>
                          <span>Qty</span>
                          <span>Price</span>
                          <span>Subtotal</span>
                        </div>
                        {orderDetails[order.id].items?.map((item) => (
                          <div key={item.id} className="order-item-row">
                            <span className="order-item-name">{item.name || `Product #${item.product_id}`}</span>
                            <span>{item.quantity}</span>
                            <span>₹{Number(item.price).toLocaleString('en-IN')}</span>
                            <span className="order-item-subtotal">
                              ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="skeleton" style={{ height: 60, borderRadius: 4 }} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
