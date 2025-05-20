import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import ProductList from './components/products/ProductList';
import ProductDetail from './components/products/ProductDetail';
import NotFound from './components/pages/NotFound';
import testApiConnection from './testApiConnection';

function App() {
  const [apiStatus, setApiStatus] = useState({ tested: false, working: false, error: null });
  
  useEffect(() => {
    // Test API connection when the app starts
    testApiConnection()
      .then(data => {
        console.log('API test successful:', data);
        setApiStatus({ tested: true, working: true, error: null });
      })
      .catch(err => {
        console.error('API test failed:', err);
        setApiStatus({ tested: true, working: false, error: err.message });
      });
  }, []);
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        
        {/* API Status Indicator */}
        {apiStatus.tested && !apiStatus.working && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">API Connection Error: </strong>
            <span className="block sm:inline">The application cannot connect to the server. {apiStatus.error}</span>
            <p className="mt-2">
              Please ensure the server is running at http://localhost:5001. 
              Try running <code className="bg-gray-200 p-1 rounded">cd server && node server.js</code> in a terminal.
            </p>
          </div>
        )}
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
