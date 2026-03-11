import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiChevronDown, FiMapPin, FiBox, FiHeart, FiLogOut, FiAlignJustify, FiMoreVertical, FiNavigation } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getCart } from '../services/api';
import { toast } from 'react-toastify';
import './Navbar.css';
import {
  IconForYou, IconFashion, IconMobiles, IconBeauty, IconElectronics,
  IconHome, IconAppliances, IconToys, IconFood, IconAuto,
  IconTwoWheeler, IconSports, IconBooks, IconFurniture
} from './CategoryIcons';

const SUB_CATEGORIES = [
  { name: 'For You', icon: IconForYou },
  { name: 'Fashion', icon: IconFashion },
  { name: 'Mobiles', icon: IconMobiles },
  { name: 'Beauty', icon: IconBeauty },
  { name: 'Electronics', icon: IconElectronics },
  { name: 'Home', icon: IconHome },
  { name: 'Appliances', icon: IconAppliances },
  { name: 'Toys, ba...', icon: IconToys },
  { name: 'Food & H...', icon: IconFood },
  { name: 'Auto Acc...', icon: IconAuto },
  { name: '2 Wheele...', icon: IconTwoWheeler },
  { name: 'Sports & ...', icon: IconSports },
  { name: 'Books & ...', icon: IconBooks },
  { name: 'Furniture', icon: IconFurniture }
];

export default function Navbar() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [locationPincode, setLocationPincode] = useState('Select Pincode');
  const [tempPincode, setTempPincode] = useState('');
  
  const userDropdownRef = useRef(null);
  const moreDropdownRef = useRef(null);
  const locationPopupRef = useRef(null);

  // Active sub-category logic
  const searchParams = new URLSearchParams(location.search);
  const activeCategory = searchParams.get('category') || 'For You';

  useEffect(() => {
    const fetchCart = () => {
      if (user) {
        getCart()
          .then(({ data }) => setCartCount(data.length || 0))
          .catch(() => setCartCount(0));
      } else {
        setCartCount(0);
      }
    };
    
    fetchCart();
    window.addEventListener('cartUpdated', fetchCart);
    return () => window.removeEventListener('cartUpdated', fetchCart);
  }, [user]);

  useEffect(() => {
    if (user && user.address) {
      // Try to find a 6-digit number in the address string
      const match = user.address.match(/\b\d{6}\b/);
      if (match) {
        setLocationPincode(match[0]);
      }
    } else if (!user) {
      setLocationPincode('Select Pincode');
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target)) {
        setShowMoreDropdown(false);
      }
      if (locationPopupRef.current && !locationPopupRef.current.contains(e.target)) {
        setShowLocationPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate('/');
  };

  const handleCategoryClick = (catName) => {
    if (catName === 'For You') {
      navigate('/products');
    } else {
      let mappedCat = catName;
      if (catName === 'Toys, ba...') mappedCat = 'Toys & Games';
      if (catName === 'Food & H...') mappedCat = 'Groceries';
      if (catName === 'Auto Acc...') mappedCat = 'Automotive';
      if (catName === 'Sports & ...') mappedCat = 'Sports & Outdoors';
      if (catName === 'Books & ...') mappedCat = 'Books';

      navigate(`/products?category=${encodeURIComponent(mappedCat)}`);
    }
  };

  return (
    <>
      <header className="navbar-wrapper">
      
      {/* ── Top Bar (Minutes, Travel, etc) ── */}
      <div className="navbar-top-bar">
        <div className="navbar-inner container top-bar-inner">
          <div className="top-bar-left">
            <Link to="/" className="top-brand-pill active">
              <span className="star-icon" style={{ display: 'flex' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#2874f0" stroke="#2874f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span> Flipkart
            </Link>
            <div className="top-brand-pill disabled">
              <FiBox size={16} color="#db1515" /> <span>Minutes</span>
              <span className="brand-coming-soon">Coming soon</span>
            </div>
            <div className="top-brand-pill disabled">
              <FiNavigation size={16} color="#f47f40" /> <span>Travel</span>
              <span className="brand-coming-soon">Coming soon</span>
            </div>
            <div className="top-brand-pill disabled">
              <FiShoppingCart size={16} color="#717478" /> <span>Grocery</span>
              <span className="brand-coming-soon">Coming soon</span>
            </div>
          </div>
          {user && (
            <div className="top-bar-right" ref={locationPopupRef} style={{ position: 'relative' }}>
               <button className="location-selector" onClick={() => setShowLocationPopup(!showLocationPopup)} style={{ background: 'transparent', border: 'none' }}>
                  <FiMapPin size={16} />
                  <span className="pincode">{locationPincode}</span>
                  <span className="location-text">Select delivery location &gt;</span>
               </button>
               
               {showLocationPopup && (
                 <div className="location-popup scale-in">
                   <div className="location-popup-header">
                     <h4>Choose your location</h4>
                     <p>Delivery options and delivery speeds may vary for different locations</p>
                   </div>
                   <div className="location-popup-body">
                     <div className="location-input-group">
                       <input 
                         type="text" 
                         placeholder="Enter pincode" 
                         value={tempPincode}
                         onChange={(e) => setTempPincode(e.target.value)}
                         maxLength={6}
                       />
                       <button className="btn-apply-pincode" onClick={async () => {
                          if (tempPincode.length >= 5) {
                            try {
                              // If they have an existing address, appending it. If not, just saving the pincode.
                              const newAddress = user.address ? `${user.address.replace(/\b\d{6}\b/, '').trim()} ${tempPincode}`.trim() : tempPincode;
                              await updateUser(newAddress);
                              
                              setLocationPincode(tempPincode);
                              setShowLocationPopup(false);
                              setTempPincode('');
                              toast.success('Location updated!');
                            } catch (error) {
                              toast.error('Failed to save location');
                            }
                          }
                       }}>Apply</button>
                     </div>
                   </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>

      {/* ── Main Navbar (Search & Actions) ── */}
      <nav className="navbar">
        <div className="navbar-inner container">
          
          {/* Logo (hidden on large screens in new design, kept for mobile fallback if needed, but styling will handle it) */}
          <Link to="/" className="navbar-logo-mobile">
            <span>Flipkart</span>
          </Link>

          {/* Search */}
          <form className="navbar-search" onSubmit={handleSearch}>
            <button type="submit" className="navbar-search-btn" id="search-btn">
              <FiSearch size={22} color="#717478" />
            </button>
            <input
              type="text"
              placeholder="Search for Products, Brands and More"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar-search-input"
              id="search-input"
            />
          </form>

          {/* Actions */}
          <div className="navbar-actions">
            {/* User / Login */}
            <div className="navbar-user-menu" ref={userDropdownRef}>
              <button
                className={`navbar-action-btn ${showUserDropdown ? 'active' : ''}`}
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <FiUser size={20} />
                <span>{user ? user.name?.split(' ')[0] : 'Login'}</span>
                <FiChevronDown size={14} className={`chevron ${showUserDropdown ? 'open' : ''}`} />
              </button>
              
              {showUserDropdown && (
                <div className="navbar-dropdown scale-in">
                  {!user && (
                    <div className="dropdown-login-section">
                      <span>New customer?</span>
                      <Link to="/signup" className="dropdown-signup-link" onClick={() => setShowUserDropdown(false)}>Sign Up</Link>
                    </div>
                  )}
                  {user && (
                    <Link to="/profile" className="navbar-dropdown-item" onClick={() => setShowUserDropdown(false)}>
                      <FiUser size={16} /> My Profile
                    </Link>
                  )}
                  <Link to="/orders" className="navbar-dropdown-item" onClick={() => setShowUserDropdown(false)}>
                    <FiBox size={16} /> Orders
                  </Link>
                  <Link to="/wishlist" className="navbar-dropdown-item" onClick={() => setShowUserDropdown(false)}>
                    <FiHeart size={16} /> Wishlist
                  </Link>
                  {user ? (
                    <button className="navbar-dropdown-item navbar-dropdown-logout" onClick={handleLogout}>
                      <FiLogOut size={16} /> Logout
                    </button>
                  ) : (
                    <Link to="/login" className="navbar-dropdown-item navbar-dropdown-login" onClick={() => setShowUserDropdown(false)}>
                      <FiUser size={16} /> Login
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* More */}
            <div className="navbar-user-menu" ref={moreDropdownRef}>
              <button
                className={`navbar-action-btn ${showMoreDropdown ? 'active' : ''}`}
                onClick={() => setShowMoreDropdown(!showMoreDropdown)}
              >
                <span>More</span>
                <FiChevronDown size={14} className={`chevron ${showMoreDropdown ? 'open' : ''}`} />
              </button>
              {showMoreDropdown && (
                <div className="navbar-dropdown scale-in right-align">
                  <a href="#" className="navbar-dropdown-item" onClick={(e) => e.preventDefault()}>
                    Notification Preferences
                  </a>
                  <a href="#" className="navbar-dropdown-item" onClick={(e) => e.preventDefault()}>
                    24x7 Customer Care
                  </a>
                  <a href="#" className="navbar-dropdown-item" onClick={(e) => e.preventDefault()}>
                    Advertise
                  </a>
                  <a href="#" className="navbar-dropdown-item" onClick={(e) => e.preventDefault()}>
                    Download App
                  </a>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="navbar-action-btn cart-btn">
              <div className="navbar-cart-icon-wrap">
                <FiShoppingCart size={20} />
                {cartCount > 0 && <span className="navbar-cart-badge">{cartCount}</span>}
              </div>
              <span>Cart</span>
            </Link>
          </div>
        </div>
      </nav>

      </header>

      {/* ── Category Bar ── */}
      <div className="category-bar">
        <div className="category-bar-inner container">
          {SUB_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.name || (cat.name === 'For You' && !searchParams.get('category'));
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className={`category-bar-link ${isActive ? 'active' : ''}`}
              >
                <div className="category-icon-wrapper">
                  <Icon />
                </div>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
