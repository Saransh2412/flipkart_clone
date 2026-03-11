import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach JWT to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ──
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const updateProfile = (data) => API.put('/auth/profile', data);

// ── Products ──
export const getProducts = (params) => API.get('/products', { params });
export const getProductById = (id) => API.get(`/products/${id}`);

// ── Cart ──
export const getCart = () => API.get('/cart');
export const addToCart = (productId, quantity = 1) =>
  API.post('/cart', { productId, quantity }).then(res => { window.dispatchEvent(new Event('cartUpdated')); return res; });
export const updateCartQty = (cartItemId, quantity) =>
  API.put(`/cart/${cartItemId}`, { quantity }).then(res => { window.dispatchEvent(new Event('cartUpdated')); return res; });
export const removeFromCart = (cartItemId) => 
  API.delete(`/cart/${cartItemId}`).then(res => { window.dispatchEvent(new Event('cartUpdated')); return res; });

// ── Wishlist ──
export const getWishlist = () => API.get('/wishlist');
export const addToWishlist = (productId) =>
  API.post('/wishlist', { productId });
export const removeFromWishlist = (id) => API.delete(`/wishlist/${id}`);

// ── Orders ──
export const placeOrder = (shippingAddress) =>
  API.post('/orders', { shippingAddress }).then(res => { window.dispatchEvent(new Event('cartUpdated')); return res; });
export const getOrders = () => API.get('/orders');
export const getOrderById = (id) => API.get(`/orders/${id}`);

export default API;
