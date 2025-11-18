import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const API_KEY = process.env.REACT_APP_API_KEY || 'tasknapi';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add API key to write operations
apiClient.interceptors.request.use((config) => {
  if (['post', 'put', 'delete'].includes(config.method.toLowerCase())) {
    config.headers['x-api-key'] = API_KEY;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Network error. Please check your connection.' };
    } else {
      throw { message: error.message };
    }
  }
);

export default apiClient;