import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../navbar/Navbar';

const ProductData = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(response => {
        setProducts(response.data);
        console.log(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleDelete = (productId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this product?");
    if (isConfirmed) {
      axios.delete(`http://localhost:5000/products/${productId}`)
        .then(response => {
          setProducts(products.filter(product => product._id !== productId));
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.productNameTxt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="container mx-auto px-4 py-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 mb-4 border rounded"
        />
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm uppercase font-semibold text-gray-700">Image</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm uppercase font-semibold text-gray-700">Title</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm uppercase font-semibold text-gray-700">Description</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm uppercase font-semibold text-gray-700">Number</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm uppercase font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <img className="h-16 w-16 object-cover rounded" src={`http://localhost:5000/uploads/${product.productImg}`} alt={product.productNameTxt} />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">{product.productNameTxt}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{product.descriptionTxt}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{product.priceTxt}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <button
                        className="font-bold bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center mt-6 text-lg text-gray-500">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductData;
