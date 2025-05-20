// Simple script to test API connectivity
import axios from 'axios';

// Test direct connection to the API
const testConnection = async () => {
  try {
    console.log('Testing connection to API...');
    const response = await axios.get('http://localhost:5001/api/products');
    console.log('Connection successful! Products returned:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('Connection failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw error;
  }
};

// Export the function for use in components
export default testConnection;
