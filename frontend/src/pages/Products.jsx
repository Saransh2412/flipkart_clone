import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Products.css';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Appliances', 'Home & Furniture', 'Books', 'Toys & Games', 'Sports & Outdoors', 'Beauty & Personal Care', 'Automotive', 'Groceries'];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (search) params.search = search;
    if (category) params.category = category;

    getProducts(params)
      .then(({ data }) => {
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
        setTotal(data.total || 0);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, category, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleCategoryClick = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(newPage));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="products-page fade-in">
      <div className="container products-layout">
        {/* Sidebar */}
        <aside className="products-sidebar">
          <h3 className="sidebar-title">Filters</h3>

          {/* Search */}
          <form className="sidebar-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="sidebar-search-input"
              id="sidebar-search"
            />
            <button type="submit" className="sidebar-search-btn">
              <FiSearch size={16} />
            </button>
          </form>

          {/* Categories */}
          <div className="sidebar-section">
            <h4 className="sidebar-section-title">CATEGORIES</h4>
            <div className="sidebar-categories">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`sidebar-category-btn ${
                    (cat === 'All' && !category) || cat === category ? 'active' : ''
                  }`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="products-main">
          <div className="products-header">
            <h2 className="products-title">
              {category || 'All Products'}
              {search && <span className="products-search-label"> — "{search}"</span>}
            </h2>
            <span className="products-count">{total} results</span>
          </div>

          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 320, borderRadius: 8 }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="products-empty">
              <span className="products-empty-icon">🔍</span>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                <FiChevronLeft size={18} /> Previous
              </button>
              <div className="pagination-pages">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`pagination-page ${page === i + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                className="pagination-btn"
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
