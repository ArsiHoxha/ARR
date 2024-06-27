import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [lowestPriceProduct, setLowestPriceProduct] = useState(null);
  const [highestPriceProduct, setHighestPriceProduct] = useState(null);

  useEffect(() => {
    fetchProductsPrice();
  }, []);

  const fetchProductsPrice = async () => {
    try {
      const response = await axios.get('http://localhost:5000/productsPrice');
      setProducts(response.data.products);
      setLowestPriceProduct(response.data.lowestPriceProduct);
      setHighestPriceProduct(response.data.highestPriceProduct);
    } catch (error) {
      console.error('Error fetching products price:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-8">Inventory Dashboard</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Product with Lowest quantity</h3>
        {lowestPriceProduct && (
          <div className="bg-red-100 p-4 rounded-md mb-4">
            <p className="font-medium">Name: {lowestPriceProduct.productNameTxt}</p>
            <p className="font-medium">Quantity: {lowestPriceProduct.priceTxt}</p>
            <p className="font-medium">Description: {lowestPriceProduct.descriptionTxt}</p>
          </div>
        )}
        <h3 className="text-xl font-semibold mb-4">Product with Highest Price</h3>
        {highestPriceProduct && (
          <div className="bg-green-100 p-4 rounded-md mb-4">
            <p className="font-medium">Name: {highestPriceProduct.productNameTxt}</p>
            <p className="font-medium">Quantity: {highestPriceProduct.priceTxt}</p>
            <p className="font-medium">Description: {highestPriceProduct.descriptionTxt}</p>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">All Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
              <img
                src={`http://localhost:5000/uploads/${product.productImg}`}
                alt={product.productNameTxt}
                className="w-full h-64 object-cover rounded-md mb-2"
              />
              <p className="font-medium">Name: {product.productNameTxt}</p>
              <p className="font-medium">Price: ${product.priceTxt}</p>
              <p className="font-medium">Description: {product.descriptionTxt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
