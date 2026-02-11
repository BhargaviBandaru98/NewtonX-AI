import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

/**
 * Parse physics problem using backend AI
 * @param {string} problemText - The physics word problem
 * @returns {Promise<object>} - Parsed physics data
 */
export const parsePhysicsProblem = async (problemText) => {
  try {
    const response = await api.post('/parse', {
      problem_text: problemText,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.error || 'Failed to parse problem');
    } else if (error.request) {
      // Request made but no response
      throw new Error('Cannot connect to server. Please ensure backend is running on port 5000.');
    } else {
      // Other errors
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
};

/**
 * Check backend health
 * @returns {Promise<object>} - Health status
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not responding');
  }
};

export default api;