// updateDressImage.js
// Script to update the image URL for Women's Cotton Summer Dress

const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-assistant')
  .then(() => {
    console.log('MongoDB connected for image update');
    updateProductImage();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// New image URL
const newImageUrl = 'https://ik.imagekit.io/lifeglitch/3233.jpg?updatedAt=1747503623912';

// Function to update product image
async function updateProductImage() {
  try {
    console.log('Updating Women\'s Cotton Summer Dress image...');
    
    // First, find the product
    const product = await Product.findOne({ name: 'Women\'s Cotton Summer Dress' });
    
    if (!product) {
      console.log('❌ Product "Women\'s Cotton Summer Dress" not found');
      mongoose.connection.close();
      return;
    }
    
    console.log('Current image URL:', product.imageUrl);
    
    // Update the product
    product.imageUrl = newImageUrl;
    await product.save();
    
    console.log('✅ Image updated successfully for Women\'s Cotton Summer Dress');
    console.log('New image URL:', newImageUrl);
    
    // Verify the update
    const updatedProduct = await Product.findOne({ name: 'Women\'s Cotton Summer Dress' });
    console.log('Verified image URL:', updatedProduct.imageUrl);
    
    console.log('Image update completed');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error updating product image:', err);
    mongoose.connection.close();
    process.exit(1);
  }
}