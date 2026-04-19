import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMapPin, FiBox, FiLogOut, FiHeart, FiShoppingCart, FiMail, FiShield, FiEdit3, FiCheck, FiChevronRight, FiSearch } from 'react-icons/fi';
import './Profile.css';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [saving, setSaving] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser(address);
      toast.success('Address updated successfully');
      setEditingAddress(false);
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  // Generate initials from name
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  // Member since (use a placeholder based on current date)
  const memberSince = 'April 2026';

  return (
    <div className="profile-page fade-in">
      <div className="profile-container">

        {/* ── Hero Card ── */}
        <div className="profile-hero">
          <div className="profile-hero-bg"></div>
          <div className="profile-hero-content">
            <div className="profile-avatar-large">
              <span>{initials}</span>
            </div>
            <div className="profile-hero-info">
              <h1>{user.name}</h1>
              <p className="profile-email">
                <FiMail size={14} />
                {user.email}
              </p>
              <div className="profile-badge">
                <FiShield size={12} />
                <span>Member since {memberSince}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick Actions Grid ── */}
        <div className="profile-quick-actions">
          <Link to="/orders" className="profile-action-card">
            <div className="action-icon orders">
              <FiBox size={22} />
            </div>
            <div className="action-text">
              <h3>My Orders</h3>
              <p>Track, return, or buy again</p>
            </div>
            <FiChevronRight size={18} className="action-chevron" />
          </Link>

          <Link to="/wishlist" className="profile-action-card">
            <div className="action-icon wishlist">
              <FiHeart size={22} />
            </div>
            <div className="action-text">
              <h3>Wishlist</h3>
              <p>Your saved items</p>
            </div>
            <FiChevronRight size={18} className="action-chevron" />
          </Link>

          <Link to="/cart" className="profile-action-card">
            <div className="action-icon cart">
              <FiShoppingCart size={22} />
            </div>
            <div className="action-text">
              <h3>Shopping Cart</h3>
              <p>Items ready to checkout</p>
            </div>
            <FiChevronRight size={18} className="action-chevron" />
          </Link>
        </div>

        {/* ── Account Details ── */}
        <div className="profile-details-grid">

          {/* Personal Info Card */}
          <div className="profile-card">
            <div className="profile-card-header">
              <div className="card-header-left">
                <FiUser size={18} />
                <h2>Personal Information</h2>
              </div>
            </div>
            <div className="profile-card-body">
              <div className="profile-field">
                <label>Full Name</label>
                <div className="profile-field-value">{user.name}</div>
              </div>
              <div className="profile-field">
                <label>Email Address</label>
                <div className="profile-field-value">{user.email}</div>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="profile-card">
            <div className="profile-card-header">
              <div className="card-header-left">
                <FiMapPin size={18} />
                <h2>Shipping Address</h2>
              </div>
              {!editingAddress && (
                <button className="card-edit-btn" onClick={() => setEditingAddress(true)}>
                  <FiEdit3 size={14} />
                  Edit
                </button>
              )}
            </div>
            <div className="profile-card-body">
              {editingAddress ? (
                <form onSubmit={handleSave} className="profile-address-form">
                  <div className="profile-input-wrap">
                    <FiMapPin className="input-icon" size={16} />
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your full shipping address including city, state, and pincode"
                      className="profile-textarea"
                      rows={3}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-save" disabled={saving}>
                      <FiCheck size={16} />
                      {saving ? 'Saving...' : 'Save Address'}
                    </button>
                    <button type="button" className="btn-cancel" onClick={() => { setEditingAddress(false); setAddress(user?.address || ''); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-field">
                  <label>Default Address</label>
                  <div className="profile-field-value address">
                    {user.address || <span className="no-address">No address saved yet. Click Edit to add one.</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Danger Zone ── */}
        <div className="profile-danger-zone">
          <button className="btn-logout" onClick={handleLogout}>
            <FiLogOut size={18} />
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}
