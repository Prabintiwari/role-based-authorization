import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL|| 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const signup = (data) => api.post('/users/signup', data);
export const login = (data) => api.post('/users/login', data);
export const getCurrentUser = () => api.get('/users/my-profile');

// reset password
export const forgotPassword = (data)=>api.post('/users/forgot-password',data)
export const verifyOtp = (data)=>api.post('/users/verify-otp',data)
export const resetPassword = (data)=>api.post('/users/reset-password',data)

// Products
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products/createProduct/role', data);
export const updateProduct = (id, data) => api.put(`/products/${id}/role`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}/role`);

// Users
export const getUsers = () => api.get('/users');
export const updateUserRole = (id, role) => api.put(`/users/${id}/role`, { role });
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Carts
export const getMyCarts = () => api.get('/carts/get-my-cart');
export const addToCart = (productId) => api.post('/carts/add-to-cart', { productId });
export const updateCartQuantity = (productId, action) =>api.put('/carts/update-quantity', { productId, action });
export const deleteCart = () => api.delete('/carts/clear-cart');
export const removeFromCart = (productId) =>api.delete(`/carts/remove-item/${productId}`);

export default api;