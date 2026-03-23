import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token from localStorage
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: on 401, clear token and redirect to login;
// on network/server errors, attach a user-friendly message.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/login') ||
                             error.config?.url?.includes('/auth/register') ||
                             error.config?.url?.includes('/auth/change-password');
      if (!isAuthEndpoint) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (!error.response) {
      // Network error — server unreachable or request never left
      error.userMessage = 'Network error. Please check your connection and try again.';
    } else {
      // Other HTTP errors (4xx, 5xx)
      error.userMessage = `Server error (${error.response.status}). Please try again later.`;
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
