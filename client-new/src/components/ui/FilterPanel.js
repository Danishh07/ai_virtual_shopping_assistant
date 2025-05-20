import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FilterPanel = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState(['men', 'women', 'kids', 'unisex']);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    // Fetch filter options from API
    const fetchFilterOptions = async () => {
      try {
        // In a real app, you would have API endpoints to get unique values for each filter
        // For simplicity, we'll hardcode some values here
        setSubcategories([
          't-shirt', 'jeans', 'dress', 'sneakers', 'heels', 'shirt', 
          'jacket', 'pants', 'accessories', 'shoes'
        ]);
        
        setBrands([
          'UrbanStep', 'Florelle', 'DenimCo', 'KidZone', 'Elegance',
          'FormalEdge', 'OutdoorPro', 'FitFlex', 'SchoolBuddy', 'SpeedRunner'
        ]);
        
        setMaterials([
          'cotton', 'denim', 'synthetic leather', 'polyester', 'spandex blend'
        ]);
        
        setColors([
          'black', 'white', 'blue', 'red', 'grey', 'navy', 'yellow', 'pink', 'green', 'floral'
        ]);
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      category: '',
      subcategory: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      material: '',
      color: '',
      size: ''
    };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button 
          onClick={clearFilters}
          className="text-sm text-primary hover:underline"
        >
          Clear All
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={localFilters.category}
              onChange={handleInputChange}
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Subcategory Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Type
            </label>
            <select
              name="subcategory"
              value={localFilters.subcategory}
              onChange={handleInputChange}
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">All Types</option>
              {subcategories.map(subcategory => (
                <option key={subcategory} value={subcategory}>
                  {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range (₹)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={localFilters.minPrice}
                onChange={handleInputChange}
                min="0"
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={localFilters.maxPrice}
                onChange={handleInputChange}
                min="0"
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          
          {/* Brand Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <select
              name="brand"
              value={localFilters.brand}
              onChange={handleInputChange}
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          
          {/* Material Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Material
            </label>
            <select
              name="material"
              value={localFilters.material}
              onChange={handleInputChange}
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">All Materials</option>
              {materials.map(material => (
                <option key={material} value={material}>
                  {material.charAt(0).toUpperCase() + material.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Color Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <select
              name="color"
              value={localFilters.color}
              onChange={handleInputChange}
              className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">All Colors</option>
              {colors.map(color => (
                <option key={color} value={color}>
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterPanel;
