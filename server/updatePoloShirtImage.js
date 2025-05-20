// updatePoloShirtImage.js
// Script to update the image URL for Men's Casual Polo Shirt

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
const newImageUrl = 'https://ik.imagekit.io/lifeglitch/2149659069%20(1).jpg?updatedAt=1747508038760';

// Function to update product image
async function updateProductImage() {
  try {
    console.log("Updating Men's Casual Polo Shirt image...");
    
    // First, find the product
    const product = await Product.findOne({ name: "Men's Casual Polo Shirt" });
    
    if (!product) {
      console.log('❌ Product "Men\'s Casual Polo Shirt" not found');
      mongoose.connection.close();
      return;
    }
    
    console.log('Current image URL:', product.imageUrl);
    
    // Update the product
    product.imageUrl = newImageUrl;
    await product.save();
    
    console.log('✅ Image updated successfully for Men\'s Casual Polo Shirt');
    console.log('New image URL:', newImageUrl);
    
    // Verify the update
    const updatedProduct = await Product.findOne({ name: "Men's Casual Polo Shirt" });
    console.log('Verified image URL:', updatedProduct.imageUrl);
    
    console.log('Image update completed');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error updating product image:', err);
    mongoose.connection.close();
    process.exit(1);
  }
}
