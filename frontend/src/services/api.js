import axios from 'axios';

const API_BASE_URL = `${process.env.REACT_APP_SERVER_URL || 'http://localhost:5000'}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getCurrentUser: () =>
    api.get('/auth/me')
};

// Rooms API
export const roomsAPI = {
  createRoom: (name) =>
    api.post('/rooms', { name }),
  getRooms: () =>
    api.get('/rooms'),
  getRoom: (roomId) =>
    api.get(`/rooms/${roomId}`),
  joinRoom: (roomId) =>
    api.post(`/rooms/${roomId}/join`)
};

// Upload API
export const uploadAPI = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default api;