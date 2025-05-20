// debugSearchQuery.js
// Utility to test how the AI interprets a search query

const mongoose = require('mongoose');
const { model } = require('./config/gemini');
const Product = require('./models/Product');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-assistant')
  .then(() => console.log('MongoDB connected for search debugging'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test a search query
const testSearch = async (query) => {
  try {
    console.log(`Testing search for: "${query}"`);
    
    // Prompt for Gemini to analyze the fashion search query
    const prompt = `
    You are a fashion shopping assistant. Analyze the following query and extract structured information about the fashion products being searched for.
    
    Query: "${query}"
    
    Respond with ONLY a valid JSON object with the following structure:
    {
      "category": "men", "women", "kids", or "unisex",
      "subcategory": specific product type (e.g., "t-shirt", "jeans", "sneakers"),
      "priceRange": {"min": number or null, "max": number or null},
      "colors": [array of colors],
      "brand": specific brand name or null,
      "material": specific material (e.g., "cotton", "leather") or null,
      "keywords": [array of important search keywords]
    }
    
    Don't include any explanations or markdown formatting, just the JSON object.
    `;

    // Call Gemini API to analyze the query
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Parse the JSON response from Gemini
    let analysisResult;
    try {
      // Extract JSON if it's wrapped in code blocks or has extra text
      const jsonMatch = responseText.match(/({[^]*})/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      analysisResult = JSON.parse(jsonString);
      console.log('\nAI Search Analysis:');
      console.log(JSON.stringify(analysisResult, null, 2));
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      console.log('Raw response:', responseText);
      return;
    }
    
    // Generate search parameters
    const searchParams = {};
    
    if (analysisResult.category) {
      searchParams.category = analysisResult.category;
    }
    
    if (analysisResult.subcategory) {
      searchParams.subcategory = analysisResult.subcategory;
    }
    
    if (analysisResult.priceRange && analysisResult.priceRange.max) {
      searchParams.price = { $lte: analysisResult.priceRange.max };
    }
    
    if (analysisResult.priceRange && analysisResult.priceRange.min) {
      searchParams.price = { ...searchParams.price, $gte: analysisResult.priceRange.min };
    }
    
    if (analysisResult.colors && analysisResult.colors.length > 0) {
      // Search for colors in tags instead of the colors array
      const colorQueries = analysisResult.colors.map(color => ({
        tags: { $regex: new RegExp(color, 'i') }
      }));
      
      searchParams.$or = colorQueries;
    }
    
    if (analysisResult.brand) {
      searchParams.brand = analysisResult.brand;
    }
    
    if (analysisResult.material) {
      searchParams.material = analysisResult.material;
    }
    
    // Add enhanced text search
    if (analysisResult.keywords && analysisResult.keywords.length > 0) {
      const textSearchQuery = analysisResult.keywords.join(' ');
      
      // Create a more flexible search with regular expressions
      const regexQueries = analysisResult.keywords.map(keyword => [
        { name: { $regex: new RegExp(keyword, 'i') } },
        { description: { $regex: new RegExp(keyword, 'i') } },
        { tags: { $regex: new RegExp(keyword, 'i') } }
      ]).flat();
      
      // If we already have an $or from color search, combine with it
      if (searchParams.$or) {
        searchParams.$or = [...searchParams.$or, ...regexQueries];
      } else {
        searchParams.$or = regexQueries;
      }
      
      // Also add text search as a backup
      searchParams.$text = { $search: textSearchQuery };
    }
    
    console.log('\nSearch Parameters:');
    console.log(JSON.stringify(searchParams, null, 2));
    
    // Search for products matching the parameters
    const products = await Product.find(searchParams);
    
    console.log(`\nFound ${products.length} matching products:`);
    
    // Show summary of found products
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price} (${product.category}, ${product.subcategory})`);
      console.log(`   Tags: ${product.tags.join(', ')}`);
    });
    
  } catch (err) {
    console.error('Error during search test:', err);
  } finally {
    mongoose.disconnect();
  }
};

// Run the test with command line argument
const searchQuery = process.argv[2] || 'shirt under 2000';
testSearch(searchQuery);
