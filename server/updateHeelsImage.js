const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-assistant')
  .then(() => console.log('MongoDB connected for image update'))
  .catch(err => console.error('MongoDB connection error:', err));

const updateHeelsImage = async () => {
  try {
    console.log("Updating Women's Red High Heels image...");
    // Find the product
    const product = await Product.findOne({ name: "Women's Red High Heels" });
    
    if (!product) {
      console.log("Product not found");
      mongoose.disconnect();
      return;
    }
    
    console.log("Current image URL:", product.imageUrl);
    
    // Update the image URL
    product.imageUrl = "https://ik.imagekit.io/lifeglitch/output%20(3).jpg?updatedAt=1747509142070";
    await product.save();
    
    // Verify the update
    const updatedProduct = await Product.findOne({ name: "Women's Red High Heels" });
    console.log("✅ Image updated successfully for Women's Red High Heels");
    console.log("New image URL:", updatedProduct.imageUrl);
    console.log("Verified image URL:", updatedProduct.imageUrl);
    
    console.log("Image update completed");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error updating Women's Red High Heels image:", error);
    mongoose.disconnect();
  }
};

updateHeelsImage();
