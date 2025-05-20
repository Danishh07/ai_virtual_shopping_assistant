const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

// Access the API key from environment variables
const API_KEY = process.env.GEMINI_API_KEY;

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(API_KEY);

// Get the gemini model - updated to use the latest model name (gemini-2.0-flash)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

module.exports = {
  genAI,
  model
};
