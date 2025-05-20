const express = require('express');
const router = express.Router();
const { model } = require('../config/gemini');
const Product = require('../models/Product');

// Helper function to generate search parameters from Gemini API response
const generateSearchParams = (analysisResult) => {
  const params = {};
  
  if (analysisResult.category) {
    params.category = analysisResult.category;
  }
  
  if (analysisResult.subcategory) {
    params.subcategory = analysisResult.subcategory;
  }
    // Handle price ranges
  if (analysisResult.priceRange) {
    params.price = {};
    if (analysisResult.priceRange.max) {
      params.price.$lte = analysisResult.priceRange.max;
    }
    if (analysisResult.priceRange.min) {
      params.price.$gte = analysisResult.priceRange.min;
    }
  }

  // Create an array to store all OR conditions
  let orConditions = [];

  // Handle colors in tags
  if (analysisResult.colors && analysisResult.colors.length > 0) {
    const colorQueries = analysisResult.colors.map(color => ({
      tags: { $regex: new RegExp(color, 'i') }
    }));
    orConditions = [...orConditions, ...colorQueries];
  }

  // Handle brand matching (case-insensitive)
  if (analysisResult.brand) {
    orConditions.push({ brand: { $regex: new RegExp(analysisResult.brand, 'i') } });
  }

  // Handle material matching (case-insensitive)
  if (analysisResult.material) {
    orConditions.push(
      { material: { $regex: new RegExp(analysisResult.material, 'i') } },
      { tags: { $regex: new RegExp(analysisResult.material, 'i') } }
    );
  }
  
  return params;
};

// @route   POST api/ai/search
// @desc    Process natural language search using Gemini API
// @access  Public
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ msg: 'Query is required' });
    }
      // Enhanced prompt for better search query understanding
    const prompt = `
    You are a fashion shopping assistant. Analyze the following search query and extract detailed information to help find relevant products.

    Query: "${query}"

    Instructions:
    1. Break down natural language queries like "under 2000" into proper price ranges
    2. Include all relevant words as keywords, including colors, types, etc.
    3. Consider both exact and related terms (e.g., "top" might include "shirt", "blouse", etc.)
    4. Pay attention to price constraints in any format

    Respond with ONLY a valid JSON object with this structure:
    {
      "category": "men", "women", "kids", or "unisex",
      "subcategory": specific product type (e.g., "t-shirt", "jeans", "sneakers"),
      "priceRange": {
        "min": number or null,
        "max": number or null
      },
      "colors": [array of colors mentioned or implied],
      "brand": specific brand name or null,
      "material": specific material (e.g., "cotton", "leather") or null,
      "keywords": [
        Include ALL relevant search terms including:
        - The main product type (e.g., "shirt", "dress")
        - Colors mentioned
        - Materials mentioned
        - Any descriptive terms (e.g., "formal", "casual")
        - Related product types (e.g., if searching for "top", include "shirt", "blouse")
      ]
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
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return res.status(500).json({ 
        msg: 'Error processing natural language query',
        rawResponse: responseText
      });
    }
    
    // Generate MongoDB query params based on the analysis
    const searchParams = generateSearchParams(analysisResult);    // Add text search if we have keywords
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
      
      console.log('Search keywords:', analysisResult.keywords);
      console.log('Generated regex queries:', JSON.stringify(regexQueries, null, 2));
    }
    
    // Add price check for queries like "under 2000"
    if (analysisResult.priceRange && analysisResult.priceRange.max) {
      searchParams.price = { $lte: analysisResult.priceRange.max };
      console.log(`Added price filter: under ${analysisResult.priceRange.max}`);
    }
    
    // Search for products matching the parameters
    const products = await Product.find(searchParams);
    
    res.json({
      products,
      analysisResult,
      searchParams
    });
    
  } catch (err) {
    console.error('AI Search Error:', err);
    res.status(500).json({ 
      msg: 'Server Error',
      error: err.message
    });
  }
});

module.exports = router;
