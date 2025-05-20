import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL?.trim() || '/api';

// Product API calls
export const getProducts = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/search/${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// AI-powered search
export const searchWithAI = async (query) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ai/search`, { query });
    return response.data;
  } catch (error) {
    console.error('Error with AI search:', error);
    throw error;
  }
};

export default {
  getProducts,
  getProductById,
  searchProducts,
  searchWithAI
};