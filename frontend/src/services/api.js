import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include of auth token
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

// Auth API
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  logout: () => {
    localStorage.removeItem('token');
  }
};

// Case API
export const caseService = {
  getAll: () => api.get('/cases'),
  getById: (id) => api.get(`/cases/${id}`),
  create: (caseData) => api.post('/cases', caseData),
  update: (id, caseData) => api.put(`/cases/${id}`, caseData),
  delete: (id) => api.delete(`/cases/${id}`)
};

// Bid API
export const bidService = {
  getByCase: (caseId) => api.get(`/bids/case/${caseId}`),
  create: (bidData) => api.post('/bids', bidData),
  accept: (id) => api.put(`/bids/${id}/status`, { status: 'accepted' }),
  reject: (id) => api.put(`/bids/${id}/status`, { status: 'rejected' })
};

export default api;
