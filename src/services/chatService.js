import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5004/api';

// Create axios instance for chat API
const chatApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
chatApi.interceptors.request.use(
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

// Chat API service
export const chatService = {
  // Get messages for a specific case
  getCaseMessages: (caseId) => chatApi.get(`/messages/case/${caseId}`),
  
  // Send a new message
  sendMessage: (messageData) => chatApi.post('/messages', messageData),
  
  // Mark messages as read
  markAsRead: (caseId) => chatApi.put(`/messages/read/${caseId}`),
  
  // Get unread message count
  getUnreadCount: () => chatApi.get('/messages/unread'),
  
  // Get chat partners
  getChatPartners: () => chatApi.get('/messages/partners')
};

export default chatService;
