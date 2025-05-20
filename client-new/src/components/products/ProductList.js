import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import SearchBar from '../ui/SearchBar';
import FilterPanel from '../ui/FilterPanel';
import axios from 'axios';

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    brand: searchParams.get('brand') || '',
    material: searchParams.get('material') || '',
    color: searchParams.get('color') || '',
    size: searchParams.get('size') || ''
  });

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Build query parameters from searchParams and filters
      const queryParams = new URLSearchParams();
      
      // Add all non-empty filters to the query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      try {
        console.log('Attempting to fetch products from:', `/api/products?${queryParams.toString()}`);
        // Try with explicit server URL since we're having connection issues
        const response = await axios.get(`http://localhost:5001/api/products?${queryParams.toString()}`);
        console.log('Product response:', response.data);
        setProducts(response.data);
      } catch (apiErr) {
        console.error('API Error details:', apiErr.message, apiErr.response?.status, apiErr.response?.data);
        console.error('API Error, fetching sample data:', apiErr);
        // Load sample data as fallback
        setProducts([
          {
            "_id": "sample1",
            "name": "Classic Black Sneakers",
            "description": "Comfortable black sneakers perfect for everyday wear. Features cushioned insoles and durable rubber soles.",
            "price": 1899,
            "category": "unisex",
            "subcategory": "sneakers",
            "imageUrl": "https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "brand": "UrbanStep",
            "sizes": ["UK6", "UK7", "UK8", "UK9", "UK10"],
            "material": "synthetic leather",
            "inStock": true,
            "tags": "sneakers black casual footwear",
            "rating": 4.3
          },
          {
            "_id": "sample2",
            "name": "Women's Cotton Summer Dress",
            "description": "Light and breezy cotton summer dress. Perfect for hot summer days.",
            "price": 1499,
            "category": "women",
            "subcategory": "dress",
            "imageUrl": "https://images.pexels.com/photos/6765164/pexels-photo-6765164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "brand": "Florelle",
            "sizes": ["XS", "S", "M", "L", "XL"],
            "material": "cotton",
            "inStock": true,
            "tags": "dress summer floral cotton",
            "rating": 4.7
          }
        ]);
      }
    } catch (err) {
      console.error('Error in fetchProducts:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting AI search with query:', query);
      // Try with explicit server URL since we're having connection issues
      const response = await axios.post('http://localhost:5001/api/ai/search', { query });
      console.log('Search response:', response.data);
      
      if (response.data.products.length === 0) {
        // Log search analysis to help debug
        console.log('Search criteria used:', response.data.searchParams);
        console.log('AI analysis:', response.data.analysisResult);
        
        // Try a fallback search for common terms
        try {
          console.log('Attempting fallback search...');
          const fallbackQueries = query.toLowerCase().split(/\s+/);
          
          // Look for price terms like "under 2000" or "below 3000"
          const priceMatch = query.match(/under\s+(\d+)/i) || query.match(/below\s+(\d+)/i) || query.match(/less\s+than\s+(\d+)/i);
          const priceTag = priceMatch ? `under${priceMatch[1]}` : null;
          
          if (priceTag) {
            fallbackQueries.push(priceTag);
          }
          
          // Create a regex to search with basic terms
          const searchTerms = fallbackQueries.filter(term => term.length > 2);
          if (searchTerms.length > 0) {
            const fallbackResponse = await axios.get(`http://localhost:5001/api/products?tags=${searchTerms.join(',')}`);
            if (fallbackResponse.data && fallbackResponse.data.length > 0) {
              console.log('Fallback search found products:', fallbackResponse.data.length);
              setProducts(fallbackResponse.data);
              return;
            }
          }
        } catch (fallbackErr) {
          console.error('Fallback search failed:', fallbackErr);
        }
        
        setError('No products found matching your search criteria.');
      } else {
        setProducts(response.data.products);
      }
    } catch (err) {
      console.error('Search error details:', err.message, err.response?.status, err.response?.data);
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    // Apply filters and fetch products
    fetchProducts();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <SearchBar onSearch={handleSearch} loading={loading} />
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <FilterPanel 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        <div className="w-full md:w-3/4">          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-md">
              <div className="mb-4">{error}</div>
              
              {/* Display sample products when server is unavailable */}
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-t border-gray-300 pt-4 mt-4">Sample Products (Server Unavailable)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    "_id": "sample1",
                    "name": "Classic Black Sneakers",
                    "description": "Comfortable black sneakers perfect for everyday wear.",
                    "price": 1899,
                    "category": "unisex",
                    "subcategory": "sneakers",
                    "imageUrl": "https://img.freepik.com/free-photo/men-shoes_1203-7424.jpg?w=1480&t=st=1747502790~exp=1747506390~hmac=dc9cb23343db6c2df2d6c6656688c1b6d32866b898f3452cb0a0d9149200a20d",
                    "brand": "UrbanStep",
                    "rating": 4.3
                  },
                  {
                    "_id": "sample2",                    "name": "Women's Cotton Summer Dress",
                    "description": "Light and breezy cotton summer dress.",
                    "price": 1499,
                    "category": "women",
                    "subcategory": "dress",
                    "imageUrl": "https://ik.imagekit.io/lifeglitch/3233.jpg?updatedAt=1747503623912",
                    "brand": "Florelle",
                    "rating": 4.7
                  }
                ].map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 text-gray-600">
                {products.length} products found
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
