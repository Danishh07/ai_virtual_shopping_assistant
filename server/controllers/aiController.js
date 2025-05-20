const { model } = require('../config/gemini');
const Product = require('../models/Product');

// Search products with natural language using Gemini AI
exports.searchWithAI = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Generate a structured query interpretation using Gemini AI    
    const prompt = `
    I want you to analyze this fashion product search query and extract structured information to help me search a database.
    
    Query: "${query}"
    
    Return a JSON object with these fields (include only if mentioned or implied in the query):
    
    {
      "category": "men", "women", "kids", or "unisex",
      "subcategory": "t-shirt", "jeans", "dress", "shoes", etc.,
      "colors": ["color1", "color2", etc.],
      "priceRange": {
        "min": number or null,
        "max": number or null
      },
      "brand": brand name or null,
      "material": material type or null,
      "keywords": ["keyword1", "keyword2", etc.]
    }
    
    Only include fields that are explicitly or implicitly mentioned in the query.
    Return valid JSON with numeric values for prices (not strings).
    If currency is mentioned (like INR, ₹, $), convert to numbers only.
    `;
    
    // Get response from Gemini
    const response = await model.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt + query
    });
    const text = response.text;
      // Parse the JSON from the response
    let searchParams;
    try {
      // Extract JSON object if it's embedded in text
      const jsonMatch = text.match(/(\{[\s\S]*\})/);
      if (jsonMatch && jsonMatch[0]) {
        searchParams = JSON.parse(jsonMatch[0]);
      } else {
        searchParams = JSON.parse(text);
      }
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return res.status(500).json({ 
        message: 'Error parsing AI response',
        aiResponse: text
      });
    }

    // Build MongoDB query from AI parameters
    const mongoQuery = {};
    let textSearchQuery = '';

    // Add category filter if present
    if (searchParams.categories && searchParams.categories.length > 0) {
      mongoQuery.category = { $in: searchParams.categories };
    }

    // Add subcategory filter if present
    if (searchParams.subcategories && searchParams.subcategories.length > 0) {
      mongoQuery.subcategory = { $in: searchParams.subcategories };
    }

    // Add brand filter if present
    if (searchParams.brands && searchParams.brands.length > 0) {
      mongoQuery.brand = { $in: searchParams.brands };
    }    // Add color filter if present
    if (searchParams.colors && searchParams.colors.length > 0) {
      // Search in tags for color mentions since we removed the colors array
      const colorQueries = searchParams.colors.map(color => ({
        tags: { $regex: new RegExp(color, 'i') }
      }));
      
      if (!mongoQuery.$or) {
        mongoQuery.$or = colorQueries;
      } else {
        mongoQuery.$or = [...mongoQuery.$or, ...colorQueries];
      }
    }

    // Add material filter if present
    if (searchParams.materials && searchParams.materials.length > 0) {
      mongoQuery.material = { $in: searchParams.materials };
    }

    // Add size filter if present
    if (searchParams.sizes && searchParams.sizes.length > 0) {
      mongoQuery.sizes = { $in: searchParams.sizes };
    }

    // Add price range if present
    if (searchParams.minPrice !== undefined || searchParams.maxPrice !== undefined) {
      mongoQuery.price = {};
      if (searchParams.minPrice !== undefined) {
        mongoQuery.price.$gte = searchParams.minPrice;
      }
      if (searchParams.maxPrice !== undefined) {
        mongoQuery.price.$lte = searchParams.maxPrice;
      }
    }

    // Add keywords to text search
    if (searchParams.keywords && searchParams.keywords.length > 0) {
      textSearchQuery = searchParams.keywords.join(' ');
    }

    // Execute search
    let products;
    if (textSearchQuery) {
      products = await Product.find(
        { 
          ...mongoQuery,
          $text: { $search: textSearchQuery } 
        },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } });
    } else {
      products = await Product.find(mongoQuery);
    }

    res.json({
      searchParams,
      products,
      count: products.length
    });
  } catch (err) {
    console.error('Error searching with AI:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
