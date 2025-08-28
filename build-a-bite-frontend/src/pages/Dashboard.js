import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import FarmGuide from '../components/FarmGuid';
import { useNavigate } from 'react-router-dom';
import DifficultySelector from '../components/difficultySelector';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // ✅ for modal
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch User Info
    axiosClient.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null));

    // Fetch Products List
    axiosClient.get('/products')
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  // ✅ Show difficulty selector instead of hardcoding beginner
  const handleStartGame = (product) => {
    setSelectedProduct(product);
  };

  // ✅ Callback from DifficultySelector
  const handleDifficultySelect = (difficulty) => {
    if (!selectedProduct) return;
    navigate(`/game/${encodeURIComponent(selectedProduct._id)}/${difficulty}`);
    setSelectedProduct(null); // close modal
  };

  return (
    <div className="min-h-screen bg-softWhite p-6 font-kidsFont">
      <h2 className="text-4xl font-extrabold text-farmGreenDark mb-6">
        Welcome, {user ? user.name : 'friend'}!
      </h2>

      <FarmGuide message="Let's get farming! Select a product to start growing your farm." />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
        {products.map((product) => (
          <div
            key={product._id || product.name}
            className="rounded-3xl border-4 border-farmGreen p-4 shadow-lg hover:shadow-2xl bg-sunnyYellow flex flex-col items-center transition cursor-pointer"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-full mb-4 border-2 border-farmGreen shadow"
            />
            <h3 className="text-xl font-extrabold text-farmGreenDark mb-2">
              {product.name}
            </h3>
            <button
              onClick={() => handleStartGame(product)}
              className="mt-4 bg-farmGreen text-softWhite py-2 px-8 rounded-xl shadow-md hover:bg-farmGreenDark font-kidsFont text-lg font-bold transition"
            >
              Start Game
            </button>
          </div>
        ))}
      </div>

      {/* ✅ DifficultySelector modal */}
      {selectedProduct && (
        <DifficultySelector
          productId={selectedProduct._id}
          onSelectDifficulty={handleDifficultySelect}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;
