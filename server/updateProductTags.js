// updateProductTags.js
// Script to ensure all products have proper tags for better searchability

const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-assistant')
  .then(() => console.log('MongoDB connected for tag update'))
  .catch(err => console.error('MongoDB connection error:', err));

// Function to extract keywords from product data
const extractKeywords = (product) => {
  const keywords = [];
  
  // Add name words as keywords
  const nameWords = product.name.toLowerCase().split(/\s+/);
  keywords.push(...nameWords);
  
  // Add description words as keywords (excluding common words)
  const commonWords = ['and', 'with', 'for', 'the', 'from', 'that', 'this', 'these', 'those', 'are', 'is'];
  const descWords = product.description.toLowerCase().split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word));
  keywords.push(...descWords);
  
  // Add category, subcategory, material, etc.
  keywords.push(product.category);
  keywords.push(product.subcategory);
  if (product.material) keywords.push(product.material);
  
  // Add price ranges as tags
  if (product.price < 1000) keywords.push('under1000', 'cheap', 'budget');
  if (product.price < 2000) keywords.push('under2000');
  if (product.price < 3000) keywords.push('under3000');
  if (product.price < 5000) keywords.push('under5000');
  
  if (product.price >= 3000) keywords.push('premium');
  if (product.price >= 5000) keywords.push('luxury', 'expensive');
  
  // Filter out duplicates and return unique keywords
  return [...new Set(keywords)];
};

// Function to update product tags
const updateProductTags = async () => {
  try {
    console.log('Starting tag update process...');
    
    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products to update`);
    
    let updateCount = 0;
    
    for (const product of products) {
      // Get current tags
      const currentTags = product.tags || [];
      
      // Extract keywords from product data
      const extractedKeywords = extractKeywords(product);
      
      // Combine current tags with new keywords
      const newTags = [...new Set([...currentTags, ...extractedKeywords])];
      
      // Update product if tags have changed
      if (newTags.length !== currentTags.length || !currentTags.every(tag => newTags.includes(tag))) {
        const result = await Product.updateOne(
          { _id: product._id },
          { $set: { tags: newTags } }
        );
        
        if (result.modifiedCount > 0) {
          updateCount++;
          console.log(`✅ Updated tags for "${product.name}"`);
          console.log(`   Added tags: ${newTags.filter(tag => !currentTags.includes(tag)).join(', ')}`);
        }
      } else {
        console.log(`ℹ️ No tag update needed for "${product.name}"`);
      }
    }
    
    console.log(`\nTag update completed. Updated ${updateCount} out of ${products.length} products.`);
    mongoose.connection.close();
  } catch (err) {
    console.error('Error updating product tags:', err);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Run the update
updateProductTags();