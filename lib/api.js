// lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add auth token to requests automatically
api.interceptors.request.use(
  (config) => {
    // Check localStorage first (remember me), then sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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
      // Unauthorized - remove token from both storages
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
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

// ✅ Attempt Questions Functions
export const getAllPapers = async () => {
  try {
    const response = await api.get('/papers');
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch papers:", error);
    throw error;
  }
};

export const getPaperQuestions = async (paperId) => {
  try {
    const response = await api.get(`/papers/${paperId}/questions`);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch questions:", error);
    throw error;
  }
};

export const submitAnswers = async (paperId, answers) => {
  try {
    const response = await api.post(`/papers/${paperId}/submit`, {
      answers: answers,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to submit answers:", error);
    throw error;
  }
};

// Performance and Activity Functions
export const getPerformanceSummary = async () => {
  try {
    const response = await api.get('/performance/summary');
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch performance summary:", error);
    throw error;
  }
};

export const getRecentActivity = async () => {
  try {
    const response = await api.get('/activity/recent');
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch recent activity:", error);
    throw error;
  }
};

export const getAllAttempts = async () => {
  try {
    const response = await api.get('/attempts/all');
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch all attempts:", error);
    throw error;
  }
};

export const getDetailedAnalytics = async () => {
  try {
    const response = await api.get('/analytics/detailed');
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch detailed analytics:", error);
    throw error;
  }
};

// Generate AI explanation for a question
export const generateQuestionExplanation = async (questionId) => {
  try {
    const response = await api.post(`/questions/${questionId}/explanation`);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to generate explanation:", error);
    throw error;
  }
};

// Generate AI correct answer for a question
export const generateQuestionAnswer = async (questionId) => {
  try {
    const response = await api.post(`/questions/${questionId}/answer`);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to generate answer:", error);
    throw error;
  }
};

export default api;