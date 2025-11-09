// lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add auth token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses - redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - remove token and redirect to login
      localStorage.removeItem('token');
      // Don't redirect here as it might cause issues in SSR
      // Let the component handle the redirect
    }
    return Promise.reject(error);
  }
);

// ✅ Register User Function
export const registerUser = async (name, email, password) => {
  try {
    const response = await api.post("/register", {
      name,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("❌ Registration failed:", error);
    throw error; // Rethrow for further handling if needed
  }
};

export default api;