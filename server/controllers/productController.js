const Product = require('../models/Product');
const mongoose = require('mongoose');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const { category, subcategory, minPrice, maxPrice, brand, material, color, size } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (brand) filter.brand = brand;
    if (material) filter.material = material;
    if (color) filter.colors = color;
    if (size) filter.sizes = size;
    
    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Return dummy products if MongoDB is not connected
      return res.json([
        {
          _id: '1',
          name: 'Example Product 1',
          description: 'This is a sample product since the database is not connected.',
          price: 1999,
          category: 'men',
          subcategory: 'shirt',
          imageUrl: 'https://images.unsplash.com/photo-1603252109303-2751441dd157',
          brand: 'Example Brand',
          colors: ['blue'],
          sizes: ['M', 'L'],
          material: 'cotton',
          inStock: true,
          tags: ['shirt', 'men'],
          rating: 4.5
        },
        {
          _id: '2',
          name: 'Example Product 2',
          description: 'Another sample product since the database is not connected.',
          price: 2499,
          category: 'women',
          subcategory: 'dress',
          imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446',
          brand: 'Example Brand',
          colors: ['red'],
          sizes: ['S', 'M'],
          material: 'cotton',
          inStock: true,
          tags: ['dress', 'women'],
          rating: 4.2
        }
      ]);
    }
    
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message,
      note: 'This may be due to a MongoDB connection issue. Make sure MongoDB is installed and running.'
    });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Text search for products
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const products = await Product.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });
    
    res.json(products);
  } catch (err) {
    console.error('Error searching products:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
