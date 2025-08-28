import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import MinecraftGuide from '../components/MinecraftGuide';

import { useNavigate } from 'react-router-dom';

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient.get('/products')
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="min-h-screen bg-softWhite p-6 font-kidsFont">
      <h2 className="text-4xl text-farmGreenDark font-extrabold mb-6">Products</h2>
      <MinecraftGuide message="Pick a product to learn how to grow it step-by-step!" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-5">
        {products.map(product => (
          <div 
            key={product._id}
            
            onClick={() => navigate(`/game/${product._id}`)}  // ✅ navigate by ID
            className="rounded-lg border border-farmGreenDark p-4 shadow-lg hover:shadow-2xl cursor-pointer transition"
          >
            <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-md mb-2" />
            <h3 className="text-xl text-farmGreenDark font-bold">{product.name}</h3>
            <h3>{product._id}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Products;