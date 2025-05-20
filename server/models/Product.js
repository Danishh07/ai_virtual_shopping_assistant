const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: {
    type: Number
  },
  category: {
    type: String,
    required: true,
    enum: ['men', 'women', 'kids', 'unisex']
  },
  subcategory: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  colors: [{
    type: String
  }],
  sizes: [{
    type: String
  }],
  material: {
    type: String
  },
  inStock: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search
ProductSchema.index({
  name: 'text',
  description: 'text',
  brand: 'text',
  material: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Product', ProductSchema);
