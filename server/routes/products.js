const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Check if we have query parameters
    const { category, subcategory, minPrice, maxPrice, brand, material, color, tags } = req.query;
    
    // If we have search parameters, build a query object
    const searchQuery = {};
    
    if (category) searchQuery.category = category;
    if (subcategory) searchQuery.subcategory = subcategory;
    
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = Number(minPrice);
      if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
    }
    
    if (brand) searchQuery.brand = brand;
    if (material) searchQuery.material = material;
    
    // Special handling for tags - supports comma-separated list
    if (tags) {
      const tagList = tags.split(',').map(tag => tag.trim());
      
      // Create regex patterns for each tag
      const regexQueries = tagList.map(tag => ({
        $or: [
          { name: { $regex: new RegExp(tag, 'i') } },
          { description: { $regex: new RegExp(tag, 'i') } },
          { tags: { $regex: new RegExp(tag, 'i') } }
        ]
      }));
      
      // We want products that match ANY of the tags
      searchQuery.$or = regexQueries;
    }
    
    console.log('Search Query:', JSON.stringify(searchQuery, null, 2));
    
    const products = Object.keys(searchQuery).length > 0 
      ? await Product.find(searchQuery)
      : await Product.find();
      
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/products/search/:query
// @desc    Search products by text query
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    
    const products = await Product.find({
      $text: { $search: searchQuery }
    });
    
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/products/category/:category
// @desc    Get products by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/products
// @desc    Create a product (for admin use)
// @access  Private (would need auth in real app)
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
