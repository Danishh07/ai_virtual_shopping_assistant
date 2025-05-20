// updateSneakerImage.js
// Script to update the image URL for Classic Black Sneakers

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

// New image URL (Freepik image)
const newImageUrl = 'https://img.freepik.com/free-photo/men-shoes_1203-7424.jpg?w=1480&t=st=1747502790~exp=1747506390~hmac=dc9cb23343db6c2df2d6c6656688c1b6d32866b898f3452cb0a0d9149200a20d';

// Function to update product image
async function updateProductImage() {
  try {
    console.log('Updating Classic Black Sneakers image...');
    
    // First, find the product
    const product = await Product.findOne({ name: 'Classic Black Sneakers' });
    
    if (!product) {
      console.log('❌ Product "Classic Black Sneakers" not found');
      mongoose.connection.close();
      return;
    }
    
    console.log('Current image URL:', product.imageUrl);
    
    // Update the product
    product.imageUrl = newImageUrl;
    await product.save();
    
    console.log('✅ Image updated successfully for Classic Black Sneakers');
    console.log('New image URL:', newImageUrl);
    
    // Verify the update
    const updatedProduct = await Product.findOne({ name: 'Classic Black Sneakers' });
    console.log('Verified image URL:', updatedProduct.imageUrl);
    
    console.log('Image update completed');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error updating product image:', err);
    mongoose.connection.close();
    process.exit(1);
  }
}
