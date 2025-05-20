// updateDenimShortsImage.js
// Script to update the image URL for Women's Denim Shorts

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
const newImageUrl = 'https://ik.imagekit.io/lifeglitch/3d508f76-e9a7-453d-9a12-6338c00b7057.jpg?updatedAt=1747505725815';

// Function to update product image
async function updateProductImage() {
  try {
    console.log("Updating Women's Denim Shorts image...");
    
    // First, find the product
    const product = await Product.findOne({ name: "Women's Denim Shorts" });
    
    if (!product) {
      console.log('❌ Product "Women\'s Denim Shorts" not found');
      mongoose.connection.close();
      return;
    }
    
    console.log('Current image URL:', product.imageUrl);
    
    // Update the product
    product.imageUrl = newImageUrl;
    await product.save();
    
    console.log('✅ Image updated successfully for Women\'s Denim Shorts');
    console.log('New image URL:', newImageUrl);
    
    // Verify the update
    const updatedProduct = await Product.findOne({ name: "Women's Denim Shorts" });
    console.log('Verified image URL:', updatedProduct.imageUrl);
    
    console.log('Image update completed');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error updating product image:', err);
    mongoose.connection.close();
    process.exit(1);
  }
}