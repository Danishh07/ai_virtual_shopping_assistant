const mongoose = require('mongoose');
const Product = require('../models/Product');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-assistant')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample product data
const products = [  {
    name: 'Classic Black Sneakers',
    description: 'Comfortable black sneakers perfect for everyday wear. Features cushioned insoles and durable rubber soles.',
    price: 1899,
    category: 'unisex',
    subcategory: 'sneakers',
    imageUrl: 'https://ik.imagekit.io/lifeglitch/7424.jpg?updatedAt=1747503184247',
    brand: 'UrbanStep',
    sizes: ['UK6', 'UK7', 'UK8', 'UK9', 'UK10'],
    material: 'synthetic leather',
    tags: ['sneakers', 'black', 'casual', 'footwear'],
    rating: 4.3
  },  {
    name: 'Women\'s Cotton Summer Dress',
    description: 'Light and breezy cotton summer dress. Perfect for hot summer days.',
    price: 1499,
    category: 'women',
    subcategory: 'dress',
    imageUrl: 'https://ik.imagekit.io/lifeglitch/3233.jpg?updatedAt=1747503623912',
    brand: 'Florelle',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    material: 'cotton',
    tags: ['dress', 'summer', 'floral', 'cotton'],
    rating: 4.7
  },  {
    name: 'Men\'s Slim Fit Jeans',
    description: 'Classic blue slim fit jeans for men. Comfortable stretch denim that moves with you.',
    price: 2499,
    category: 'men',
    subcategory: 'jeans',
    imageUrl: 'https://ik.imagekit.io/lifeglitch/10919.jpg?updatedAt=1747503313164',
    brand: 'DenimCo',
    sizes: ['30', '32', '34', '36', '38'],
    material: 'denim',
    tags: ['jeans', 'men', 'denim', 'slim fit'],
    rating: 4.2
  },{
    name: 'Kids Colorful T-Shirt Set',
    description: 'Set of 3 colorful t-shirts for kids. Made from soft cotton, perfect for everyday wear.',
    price: 899,
    category: 'kids',
    subcategory: 't-shirt',
    imageUrl: 'https://ik.imagekit.io/lifeglitch/image.jpg?updatedAt=1747504486420',
    brand: 'KidZone',
    sizes: ['Age 2-3', 'Age 4-5', 'Age 6-7', 'Age 8-9'],
    material: 'cotton',
    tags: ['t-shirt', 'kids', 'colorful', 'set'],
    rating: 4.8
  },  {
    name: 'Women\'s Red High Heels',
    description: 'Elegant red high heels with pointed toe. Perfect for formal occasions.',
    price: 2999,
    category: 'women',
    subcategory: 'heels',
    imageUrl: 'https://ik.imagekit.io/lifeglitch/output%20(3).jpg?updatedAt=1747509142070',
    brand: 'Elegance',
    sizes: ['UK3', 'UK4', 'UK5', 'UK6', 'UK7'],
    material: 'synthetic leather',
    tags: ['heels', 'red', 'formal', 'women'],
    rating: 4.1
  },
  {    name: 'Men\'s Formal White Shirt',
    description: 'Classic white formal shirt for men. Made from high-quality cotton with a smooth finish.',
    price: 1799,
    category: 'men',
    subcategory: 'shirt',
    imageUrl: 'https://ik.imagekit.io/lifeglitch/105424.jpg?updatedAt=1747508192677',
    brand: 'FormalEdge',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: 'cotton',
    tags: ['shirt', 'formal', 'white', 'men'],
    rating: 4.5
  },
  {    
    name: 'Unisex Waterproof Jacket',
    description: 'Lightweight waterproof jacket suitable for all weather conditions. Features adjustable hood and multiple pockets.',
    price: 3499,
    category: 'unisex',
    subcategory: 'jacket',
    imageUrl: 'https://images.pexels.com/photos/6770031/pexels-photo-6770031.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    brand: 'OutdoorPro',
    sizes: ['S', 'M', 'L', 'XL'],
    material: 'polyester',
    tags: ['jacket', 'waterproof', 'unisex', 'outdoor'],
    rating: 4.6
  },
  {
    name: 'Women\'s Yoga Pants',
    description: 'Comfortable and stretchy yoga pants for women. High-waisted design with moisture-wicking fabric.',
    price: 1599,
    category: 'women',
    subcategory: 'pants',
    imageUrl: 'https://images.pexels.com/photos/8436934/pexels-photo-8436934.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    brand: 'FitFlex',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    material: 'spandex blend',
    tags: ['yoga', 'pants', 'women', 'activewear'],
    rating: 4.9
  },
  {    name: 'Kids School Backpack',
    description: 'Durable school backpack for kids with multiple compartments and padded shoulder straps.',
    price: 999,
    category: 'kids',
    subcategory: 'accessories',
    imageUrl: 'https://ik.imagekit.io/lifeglitch/a10b1709-b468-46f3-b98e-bcb5421eeb99.jpg?updatedAt=1747505149684',
    brand: 'SchoolBuddy',
    sizes: ['One Size'],
    material: 'polyester',
    tags: ['backpack', 'school', 'kids', 'accessories'],
    rating: 4.4
  },
  {
    name: 'Men\'s Running Shoes',
    description: 'Lightweight running shoes with excellent cushioning and breathable mesh upper.',
    price: 2899,
    discountPrice: 1999,
    category: 'men',
    subcategory: 'shoes',
    imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    brand: 'SpeedRunner',
    sizes: ['UK7', 'UK8', 'UK9', 'UK10', 'UK11'],
    material: 'mesh and synthetic',
    tags: ['running', 'shoes', 'men', 'sports'],
    rating: 4.7
  },
  {
    name: 'Women\'s Leather Handbag',
    description: 'Elegant leather handbag with multiple compartments and adjustable strap. Perfect for daily use or special occasions.',
    price: 3299,
    category: 'women',
    subcategory: 'accessories',
    imageUrl: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    brand: 'LuxeStyle',
    sizes: ['One Size'],
    material: 'genuine leather',
    tags: ['handbag', 'leather', 'women', 'accessories', 'fashion'],
    rating: 4.7
  },
  {    name: 'Men\'s Casual Polo Shirt',
    description: 'Comfortable cotton polo shirt for men. Perfect for casual outings and weekend wear.',
    price: 1299,
    category: 'men',
    subcategory: 'shirt',
    imageUrl: 'https://ik.imagekit.io/lifeglitch/2149659069%20(1).jpg?updatedAt=1747508038760',
    brand: 'CasualFit',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: 'cotton',
    tags: ['polo', 'shirt', 'casual', 'men', 'cotton'],
    rating: 4.3
  },
  {    name: 'Kids Winter Jacket',
    description: 'Warm and cozy winter jacket for kids with thermal lining and water-resistant outer layer.',
    price: 2499,
    category: 'kids',
    subcategory: 'jacket',
    imageUrl: 'https://ik.imagekit.io/lifeglitch/output%20(1).jpg?updatedAt=1747506644873',
    brand: 'WinterKidz',
    sizes: ['Age 3-4', 'Age 5-6', 'Age 7-8', 'Age 9-10'],
    material: 'polyester with thermal lining',
    tags: ['winter', 'jacket', 'kids', 'warm', 'outerwear'],
    rating: 4.8
  },
  {
    name: 'Unisex Sports Smartwatch',
    description: 'Advanced smartwatch with fitness tracking, heart rate monitor, and GPS. Water-resistant and suitable for all sports activities.',
    price: 5999,
    discountPrice: 4999,
    category: 'unisex',
    subcategory: 'accessories',
    imageUrl: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    brand: 'TechFit',
    sizes: ['One Size'],
    material: 'silicone and aluminum',
    tags: ['smartwatch', 'fitness', 'technology', 'sports', 'unisex'],
    rating: 4.6
  },
  {    name: 'Women\'s Denim Shorts',
    description: 'Classic denim shorts for women with distressed detailing. Perfect for summer and casual outings.',
    price: 1499,
    category: 'women',
    subcategory: 'shorts',
    imageUrl: 'https://ik.imagekit.io/lifeglitch/3d508f76-e9a7-453d-9a12-6338c00b7057.jpg?updatedAt=1747505725815',
    brand: 'DenimCo',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    material: 'denim',
    tags: ['shorts', 'denim', 'women', 'summer', 'casual'],
    rating: 4.5
  },
  {    name: 'Men\'s Leather Wallet',
    description: 'Genuine leather wallet with multiple card slots and bill compartments. Slim design fits perfectly in pocket.',
    price: 1299,
    category: 'men',
    subcategory: 'accessories',
    imageUrl: 'https://ik.imagekit.io/lifeglitch/image%20(1).jpg?updatedAt=1747504792671',
    brand: 'LeatherCraft',
    sizes: ['One Size'],
    material: 'genuine leather',
    tags: ['wallet', 'leather', 'men', 'accessories'],
    rating: 4.4
  },
  {    name: 'Kids Pajama Set',
    description: 'Soft and comfortable pajama set for kids with fun patterns. Perfect for a good night\'s sleep.',
    price: 999,
    category: 'kids',
    subcategory: 'sleepwear',
    imageUrl: 'https://ik.imagekit.io/lifeglitch/771b8ba8-27cb-4c7e-b193-fbe71875c1d1.jpg?updatedAt=1747506111051',
    brand: 'DreamComfort',
    sizes: ['Age 2-3', 'Age 4-5', 'Age 6-7', 'Age 8-9'],
    material: 'cotton',
    tags: ['pajama', 'sleepwear', 'kids', 'comfortable', 'night'],
    rating: 4.9
  },
  {
    name: 'Unisex Beanie Hat',
    description: 'Warm knitted beanie hat suitable for all genders. Perfect for cold winter days.',
    price: 799,
    category: 'unisex',
    subcategory: 'accessories',
    imageUrl: 'https://images.pexels.com/photos/375880/pexels-photo-375880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    brand: 'WinterStyle',
    sizes: ['One Size'],
    material: 'acrylic wool blend',
    tags: ['beanie', 'hat', 'winter', 'unisex', 'accessories'],
    rating: 4.3
  },  {
    name: 'Women\'s Linen Blouse',
    description: 'Lightweight and breathable linen blouse for women. Perfect for summer and spring seasons.',
    price: 1799,
    category: 'women',
    subcategory: 'tops',
    imageUrl: 'https://ik.imagekit.io/lifeglitch/2148276465.jpg?updatedAt=1747508387418',
    brand: 'NatureCo',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    material: 'linen',
    tags: ['blouse', 'linen', 'summer', 'women', 'tops'],
    rating: 4.6
  },  {
    name: 'Men\'s Chino Pants',
    description: 'Classic chino pants for men, perfect for both casual and semi-formal occasions.',
    price: 1999,
    category: 'men',
    subcategory: 'pants',
    imageUrl: 'https://ik.imagekit.io/lifeglitch/output%20(2).jpg?updatedAt=1747508515391',
    brand: 'UrbanClassic',
    sizes: ['30', '32', '34', '36', '38', '40'],    material: 'cotton twill',
    tags: ['chinos', 'pants', 'men', 'casual', 'formal'],
    rating: 4.5
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products cleared');
    
    // Insert new products
    await Product.insertMany(products);
    console.log('Database seeded with sample products');
    
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();
