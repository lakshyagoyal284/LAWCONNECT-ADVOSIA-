import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5004/api';

// Create axios instance for payment API
const paymentApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
paymentApi.interceptors.request.use(
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

// Payment API service
export const paymentService = {
  // Create payment for chat access
  createChatPayment: (paymentData) => paymentApi.post('/payments/chat-access', paymentData),
  
  // Check chat access status
  checkChatAccess: (caseId) => paymentApi.get(`/payments/chat-access/${caseId}`),
  
  // Simulate payment success (for testing)
  simulatePaymentSuccess: (paymentId) => paymentApi.post(`/payments/simulate/${paymentId}`)
};

export default paymentService;
