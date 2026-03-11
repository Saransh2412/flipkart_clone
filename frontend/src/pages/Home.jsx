import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Home.css';

// Dynamic banners will be populated below


export default function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBannerGroup, setCurrentBannerGroup] = useState(0);

  useEffect(() => {
    // Fetch a bit more products to fill multiple sections
    getProducts({ page: 1, limit: 20 })
      .then(({ data }) => {
        // Randomize the products slightly for variety
        const shuffled = (data.products || []).sort(() => 0.5 - Math.random());
        setProducts(shuffled);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // Compute dynamic banners from products (take first 6)
  const bannerProducts = products.length >= 6 ? products.slice(0, 6) : [];
  const bannerGroups = [];
  for (let i = 0; i < bannerProducts.length; i += 3) {
    bannerGroups.push(bannerProducts.slice(i, i + 3));
  }

  const slideLeft = () => {
    if (bannerGroups.length > 0) {
       setCurrentBannerGroup((prev) => (prev - 1 + bannerGroups.length) % bannerGroups.length);
    }
  };
  
  const slideRight = () => {
    if (bannerGroups.length > 0) {
       setCurrentBannerGroup((prev) => (prev + 1) % bannerGroups.length);
    }
  };

  return (
    <div className="home fade-in">
      
      {/* ── Banners Section (Multi-Image Gallery Style) ── */}
      <section className="banner-gallery container">
        <div className="banner-gallery-inner">
           <button className="gallery-nav left" onClick={slideLeft}>
             <FiChevronLeft size={24} />
           </button>
           <div className="banner-track" style={{ transform: `translateX(-${currentBannerGroup * 100}%)` }}>
             {bannerGroups.length > 0 ? bannerGroups.map((group, idx) => (
                <div key={idx} className="banner-slide">
                  <div className="banner-3-grid">
                     {group.map(p => (
                       <Link key={p.id} to={`/product/${p.id}`} className="banner-link">
                         <img src={p.images?.[0] || 'https://via.placeholder.com/800'} alt={p.name} className="banner-img" />
                       </Link>
                     ))}
                  </div>
                </div>
             )) : (
                <div className="banner-slide">
                   <div className="banner-3-grid">
                     <div className="skeleton" style={{height: 250, borderRadius: 20}}></div>
                     <div className="skeleton" style={{height: 250, borderRadius: 20}}></div>
                     <div className="skeleton" style={{height: 250, borderRadius: 20}}></div>
                   </div>
                </div>
             )}
           </div>
           <button className="gallery-nav right" onClick={slideRight}>
             <FiChevronRight size={24} />
           </button>
        </div>
        
        {/* Banner Dots */}
        {bannerGroups.length > 0 && (
          <div className="gallery-dots">
            {bannerGroups.map((_, i) => (
              <button
                key={i}
                className={`gallery-dot ${i === currentBannerGroup ? 'active' : ''}`}
                onClick={() => setCurrentBannerGroup(i)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── "Still looking for these?" Section ── */}
      <section className="still-looking-section container">
        <div className="still-looking-inner">
           <div className="section-header-red">
             <h2 className="section-title-white">Still looking for these?</h2>
           </div>
           {loading ? (
             <div className="products-grid-horizontal">
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="skeleton" style={{ height: 260, minWidth: 200, borderRadius: 8 }} />
               ))}
             </div>
           ) : (
             <div className="products-grid-horizontal hide-scroll">
               {products.slice(6, 12).map((p) => (
                 <div key={p.id} className="product-card-white-wrapper">
                    <ProductCard product={p} />
                 </div>
               ))}
               <Link to="/products" className="view-all-circle">
                 <FiChevronRight size={24} color="#000" />
               </Link>
             </div>
           )}
        </div>
      </section>

      {/* ── Deals Section ── */}
      <section className="deals-section container" style={{ marginTop: '24px' }}>
        <div className="section-header">
          <h2 className="section-title">Deals of the Day</h2>
          <Link to="/products" className="section-view-all">
            <div className="view-all-circle-small"><FiChevronRight size={18} color="#fff" /></div>
          </Link>
        </div>
        {loading ? (
          <div className="products-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 320, borderRadius: 8 }} />
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {products.slice(12, 20).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ── Promo Banner ── */}
      {!user && (
        <section className="promo-section container">
          <div className="promo-card" style={{ background: 'linear-gradient(135deg, #2874f0 0%, #1a5dc8 100%)' }}>
            <div className="promo-content">
              <h3>Free Delivery on First Order</h3>
              <p>Sign up today and get free shipping on your first purchase</p>
              <Link to="/signup" className="btn-primary" style={{ background: '#ffc200', color: '#000' }}>
                Sign Up Now
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
