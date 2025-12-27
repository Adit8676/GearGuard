import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || `http://localhost:${import.meta.env.VITE_BACKEND_PORT || 5001}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;