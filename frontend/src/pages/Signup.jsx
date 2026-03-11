import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiMapPin, FiEye, FiEyeOff } from 'react-icons/fi';
import './Auth.css';

export default function Signup() {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return toast.warn('Please fill all required fields');
    setLoading(true);
    try {
      await signup(name, email, password, address);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-container">
        <div className="auth-left">
          <h2>Looks like you're new here!</h2>
          <p>Sign up with your details to get started</p>
        </div>
        <div className="auth-right">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <FiUser className="auth-input-icon" size={18} />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-input"
                id="signup-name"
                required
              />
            </div>
            <div className="auth-input-group">
              <FiMail className="auth-input-icon" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                id="signup-email"
                required
              />
            </div>
            <div className="auth-input-group">
              <FiLock className="auth-input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                id="signup-password"
                required
              />
              <button
                type="button"
                className="auth-toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            <div className="auth-input-group">
              <FiMapPin className="auth-input-icon" size={18} />
              <input
                type="text"
                placeholder="Address (Optional)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="auth-input"
                id="signup-address"
              />
            </div>
            <button type="submit" className="auth-submit-btn" id="signup-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
            <p className="auth-switch">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
