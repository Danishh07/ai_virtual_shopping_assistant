import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Fashion AI</h3>
            <p className="text-sm text-gray-300">
              Your AI-powered fashion shopping assistant. Find the perfect outfit with natural language search.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition">Products</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/products?category=men" className="hover:text-white transition">Men</Link></li>
              <li><Link to="/products?category=women" className="hover:text-white transition">Women</Link></li>
              <li><Link to="/products?category=kids" className="hover:text-white transition">Kids</Link></li>
              <li><Link to="/products?category=unisex" className="hover:text-white transition">Unisex</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Email: info@fashionai.com</li>
              <li>Phone: +1 (123) 456-7890</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-300 text-center">
          <p>&copy; {new Date().getFullYear()} Fashion AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
