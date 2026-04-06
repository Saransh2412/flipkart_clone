import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FiUser, FiMapPin, FiBox, FiLogOut } from 'react-icons/fi';
import './Profile.css';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [address, setAddress] = useState(user?.address || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser(address);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page container fade-in">
      <div className="profile-header">
        <h1>My Account</h1>
        <p>Manage your details and view your orders.</p>
      </div>

      <div className="profile-layout">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-user-card">
            <div className="profile-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
          <nav className="profile-nav">
            <Link to="/profile" className="profile-nav-link active">
              <FiUser size={18} /> Account Details
            </Link>
            <Link to="/orders" className="profile-nav-link">
              <FiBox size={18} /> Order History
            </Link>
            <button onClick={logout} className="profile-nav-link profile-logout">
              <FiLogOut size={18} /> Sign Out
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="profile-content">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <label>Full Name</label>
                <div>{user.name}</div>
              </div>
              <div className="profile-info-item">
                <label>Email Address</label>
                <div>{user.email}</div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Shipping Details</h2>
            <form onSubmit={handleSave} className="profile-form">
              <div className="profile-input-group">
                <label>Default Shipping Address</label>
                <div className="profile-input-wrapper">
                  <FiMapPin className="profile-input-icon" size={18} />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full address"
                    className="profile-input"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary profile-save-btn" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
