const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-assistant')
  .then(() => console.log('MongoDB connected for image update'))
  .catch(err => console.error('MongoDB connection error:', err));

const updateSneakersImage = async () => {
  try {
    console.log("Updating Classic Black Sneakers image...");
    // Find the product
    const product = await Product.findOne({ name: "Classic Black Sneakers" });
    
    if (!product) {
      console.log("Product not found");
      mongoose.disconnect();
      return;
    }
    
    console.log("Current image URL:", product.imageUrl);
    
    // Update the image URL
    product.imageUrl = "https://ik.imagekit.io/lifeglitch/7424.jpg?updatedAt=1747503184247";
    await product.save();
    
    // Verify the update
    const updatedProduct = await Product.findOne({ name: "Classic Black Sneakers" });
    console.log("✅ Image updated successfully for Classic Black Sneakers");
    console.log("New image URL:", updatedProduct.imageUrl);
    console.log("Verified image URL:", updatedProduct.imageUrl);
    
    console.log("Image update completed");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error updating Classic Black Sneakers image:", error);
    mongoose.disconnect();
  }
};

updateSneakersImage();
