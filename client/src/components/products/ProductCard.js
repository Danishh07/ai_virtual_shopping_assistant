import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product._id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg">        <div className="h-48 md:h-56 bg-gray-100 relative">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-contain p-2"
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop if fallback also fails
              e.target.src = `https://via.placeholder.com/300x400?text=${encodeURIComponent(product.name)}`;
            }}
          />
          {product.discountPrice && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-gray-900 font-medium text-sm truncate">{product.name}</h3>
          
          <div className="flex items-center mt-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-xs text-gray-500">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-500 ml-auto">{product.brand}</span>
          </div>
          
          <div className="mt-2">
            {product.discountPrice ? (
              <div className="flex items-center">
                <span className="text-sm font-bold text-gray-900">₹{product.discountPrice}</span>
                <span className="text-xs text-gray-500 line-through ml-2">₹{product.price}</span>
              </div>
            ) : (
              <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
            )}
          </div>
            <div className="mt-2 flex flex-wrap gap-1">
            {product.colors && product.colors.length > 0 ? (
              <>
                {product.colors.slice(0, 3).map(color => (
                  <div 
                    key={color}
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
                {product.colors.length > 3 && (
                  <div className="text-xs text-gray-500">+{product.colors.length - 3} more</div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
