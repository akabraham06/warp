import axios from 'axios';
import toast from 'react-hot-toast';

// Configure base URL for API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for quote requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API endpoints
export const quoteAPI = {
  // Get quote for cross-currency transaction
  getQuote: async (sendCurrency, receiveCurrency, sendAmount) => {
    try {
      console.log('🌐 API Request to /quote:', { sendCurrency, receiveCurrency, sendAmount });
      const response = await api.post('/quote', {
        send_currency: sendCurrency,
        receive_currency: receiveCurrency,
        send_amount: sendAmount,
      });
      console.log('📊 API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('💥 API Error:', error);
      const message = error.response?.data?.detail || 'Failed to get quote';
      toast.error(message);
      throw new Error(message);
    }
  },
};

export const transactionAPI = {
  // Execute a transfer
  executeTransfer: async (quoteId, receiverEmail, authToken) => {
    try {
      const response = await api.post('/transfer/execute', {
        quote_id: quoteId,
        receiver_email: receiverEmail,
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to execute transfer';
      toast.error(message);
      throw new Error(message);
    }
  },

  // Get transaction history
  getTransactionHistory: async (authToken) => {
    try {
      const response = await api.get('/transfer/history', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to get transaction history';
      toast.error(message);
      throw new Error(message);
    }
  },
};

export const userAPI = {
  // Get current user profile
  getUserProfile: async (authToken) => {
    try {
      const response = await api.get('/user/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to get user profile';
      toast.error(message);
      throw new Error(message);
    }
  },
};

export const healthAPI = {
  // Health check
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend service unavailable');
    }
  },
};

export default api;
