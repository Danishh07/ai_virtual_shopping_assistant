const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const productRoutes = require('./routes/products');
const aiRoutes = require('./routes/ai');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-assistant');
    console.log('MongoDB connected');
    
    // Seed the database with sample data if it's empty
    const count = await mongoose.connection.db.collection('products').countDocuments();
    if (count === 0) {
      console.log('No products found, you may want to run the seeder script:');
      console.log('node config/seeder.js');
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Continuing with limited functionality. Some API features may not work.');
  }
};

connectDB();

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Fashion Shopping Assistant API is running',
    endpoints: {
      products: '/api/products',
      productById: '/api/products/:id',
      aiSearch: '/api/ai/search'
    }
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/ai', aiRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
