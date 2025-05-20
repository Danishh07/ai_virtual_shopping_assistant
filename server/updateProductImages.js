// updateProductImages.js
// Script to update image URLs for products with broken images

const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-assistant')
  .then(() => console.log('MongoDB connected for image update'))
  .catch(err => console.error('MongoDB connection error:', err));

// New image URLs (verified working images)
const imageUpdates = [
  {
    name: 'Women\'s Red High Heels',
    newImageUrl: 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    name: 'Women\'s Linen Blouse',
    newImageUrl: 'https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

// Function to update product images
const updateProductImages = async () => {
  try {
    console.log('Starting image URL updates...');
    
    for (const update of imageUpdates) {
      const result = await Product.updateOne(
        { name: update.name },
        { $set: { imageUrl: update.newImageUrl } }
      );
      
      if (result.matchedCount > 0) {
        console.log(`✅ Updated image for "${update.name}"`);
      } else {
        console.log(`❌ No product found with name: "${update.name}"`);
      }
    }
    
    console.log('Image update process completed');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error updating product images:', err);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Run the update
updateProductImages();
