import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductTable = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    axios.get('http://localhost:5000/auth/google/logout', { withCredentials: true })
      .then(() => {
        window.location.href = '/'; // Redirect to home after logout
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  const handleRezervoClick = (productId) => {
    if (window.confirm('Are you sure you want to reserve this product?')) {
      axios.post('http://localhost:5000/reserve', { productId, userId })
        .then(response => {
          // Update the product quantity in the UI
          setProducts(products.map(product =>
            product._id === productId ? { ...product, quantity: product.quantity - 1 } : product
          ));
          setSuccessMessage('Your reservation was successful.');
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000); // Clear message after 3 seconds
        })
        .catch(error => {
          console.error('Error reserving product:', error);
        });
    }
  };

  const filteredProducts = products.filter(product =>
    product.productNameTxt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.descriptionTxt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 py-4 text-white text-center">
        <h1 className="text-3xl font-bold">Rrobotika Hf</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Sign Out
        </button>
      </header>
      <main className="flex-1 p-4">
        <div className="p-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
          />
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 border border-green-400 rounded">
              {successMessage}
            </div>
          )}
          {filteredProducts.length === 0 ? (
            <p className="text-center mt-8 text-gray-500">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={`http://localhost:5000/uploads/${product.filename}`}
                    alt={product.productNameTxt}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-bold">{product.productNameTxt}</h2>
                    <p className="text-gray-700 dark:text-gray-900">{product.descriptionTxt}</p>
                    <p className="mt-2 font-bold">Quantity: {product.priceTxt}</p>
                    <button
                      onClick={() => handleRezervoClick(product._id)}
                      className="mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Get the product
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="w-full bg-gray-200 py-4 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} Rrobotika Hf. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ProductTable;
