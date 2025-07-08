import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://agente_local:8000';

export const analysisAPI = {
  analyzeLogs: async (logs) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/analisar_logs/`, {
        logs: logs
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing logs:', error);
      throw error;
    }
  },

  // Health check endpoint
  healthCheck: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, {
        timeout: 5000,
      });
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
};

export default analysisAPI;
