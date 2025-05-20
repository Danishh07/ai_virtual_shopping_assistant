import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../ui/SearchBar';
import ProductCard from '../products/ProductCard';
import axios from 'axios';

// Function to get reliable image IDs from Pexels for each category
const getCategoryImageId = (category) => {
  const imageIds = {
    'Men': '1043471',     // Men's fashion image
    'Women': '1462637',   // Women's fashion image
    'Kids': '5693889',    // Kids' fashion image
    'Unisex': '1159670'   // Unisex fashion image
  };
  return imageIds[category] || '1043471'; // Default to men's fashion if category not found
};

const Home = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/ai/search', { query });
      setSearchResults(response.data);
      
      // If no products found, show a message
      if (response.data.products.length === 0) {
        setError('No products found matching your search criteria.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="flex flex-col items-center">      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
          Fashion AI
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Find the perfect outfit using natural language. Try asking for "black sneakers under ₹2000" or "cotton summer dress for women".
        </p>
        
        <SearchBar onSearch={handleSearch} loading={loading} />
        
        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        {searchResults && (
          <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {searchResults.products.length} Results
              </h2>
              {searchResults.analysisResult && (
                <div className="text-sm text-gray-500 italic">
                  {searchResults.analysisResult.category && `Category: ${searchResults.analysisResult.category}`}
                  {searchResults.analysisResult.subcategory && ` • ${searchResults.analysisResult.subcategory}`}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.products.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onClick={() => handleProductClick(product._id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Featured Categories */}
      <div className="w-full mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Men', 'Women', 'Kids', 'Unisex'].map(category => (
            <div 
              key={category}
              className="relative h-40 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/products?category=${category.toLowerCase()}`)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <div className="absolute bottom-4 left-4 z-20 text-white font-semibold text-xl">
                {category}
              </div>              <img 
                src={`https://images.pexels.com/photos/${getCategoryImageId(category)}/pexels-photo-${getCategoryImageId(category)}.jpeg?auto=compress&cs=tinysrgb&w=300`} 
                alt={category} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
