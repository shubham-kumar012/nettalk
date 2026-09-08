// API configuration service for NetTalk backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Example helper to check backend health
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('API health check error:', error);
    throw error;
  }
};

export default {
  API_BASE_URL,
  checkHealth
};
