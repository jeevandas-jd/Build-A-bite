import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import FarmGuide from '../components/FarmGuid';
import { useNavigate } from 'react-router-dom';

function Products() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const navigate = useNavigate();

  const emptyProduct = {
    name: '',
    image: '',
    availableIngredients: [],
    availableProcesses: [],
    availableEquipment: [],
    correctOrder: []
  };

  const [formData, setFormData] = useState(emptyProduct);

  useEffect(() => {
    // Fetch products
    axiosClient.get('/products')
      .then(res => {
        const productsFixed = res.data.map(p => ({
          ...p,
          availableIngredients: Array.isArray(p.availableIngredients) ? p.availableIngredients : [],
          availableProcesses: Array.isArray(p.availableProcesses) ? p.availableProcesses : [],
          availableEquipment: Array.isArray(p.availableEquipment) ? p.availableEquipment : [],
          correctOrder: Array.isArray(p.correctOrder) ? p.correctOrder : [],
        }));
        setProducts(productsFixed);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });

    // Fetch current user
    axiosClient.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-spin">⚙️</div>
        <p className="text-cyan-400 font-mono text-xl">LOADING PRODUCT DATABASE...</p>
      </div>
    </div>
  );

  const handleOpenModal = (product = null) => {
    setCurrentProduct(product);
    setFormData({
      ...emptyProduct,
      ...(product || {})
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
    setFormData(emptyProduct);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert comma-separated string into array for multi-fields
    const multiFields = ['availableIngredients', 'availableProcesses', 'availableEquipment', 'correctOrder'];
    setFormData(prev => ({
      ...prev,
      [name]: multiFields.includes(name) ? value.split(',').map(s => s.trim()).filter(s => s) : value
    }));
  };

  const handleSubmit = () => {
    const apiCall = currentProduct
      ? axiosClient.put(`/products/${currentProduct._id}`, formData)
      : axiosClient.post('/products', formData);

    apiCall.then(res => {
      if (currentProduct) {
        setProducts(prev => prev.map(p => p._id === res.data._id ? res.data : p));
      } else {
        setProducts(prev => [...prev, res.data]);
      }
      handleCloseModal();
    }).catch(err => {
      alert("Failed to save product");
      console.error(err);
    });
  };

  const handleDeleteProduct = (product) => {
    if (!window.confirm("Delete this product?")) return;
    axiosClient.delete(`/products/${product._id}`)
      .then(() => setProducts(prev => prev.filter(p => p._id !== product._id)))
      .catch(err => alert("Failed to delete product"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6 font-mono relative overflow-hidden">

      <div className="relative z-10">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6 text-center">
          QUANTUM SYNTHESIS PROTOCOLS
        </h2>

        <FarmGuide message="here is all the products explore them and build what you want" />

        {user?.isAdmin && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => handleOpenModal()}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              + Add Product
            </button>
          </div>
        )}

        {products.length === 0 ? (
          <div className="bg-gray-800/70 backdrop-blur-xl border border-red-400/40 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl text-red-400 font-bold mb-2">DATABASE CONNECTION FAILED</h3>
            <p className="text-gray-400">Unable to retrieve synthesis protocols. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {products.map(product => (
              <div 
                key={product._id}
                onClick={() => navigate(`/game/${product._id}`)}
                className="bg-gray-800/60 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-5 shadow-lg hover:shadow-cyan-400/20 hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-cyan-400/20 text-cyan-400 text-xs px-2 py-1 rounded-full uppercase font-bold">
                  ID: {product._id.slice(-4)}
                </div>

                <div className="mb-4 rounded-xl overflow-hidden border border-cyan-400/20 group-hover:border-cyan-400/40 transition-all duration-300">
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>

                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
                  {product.name}
                </h3>

                <p className="text-gray-400 text-sm mb-1">Ingredients: {(product.availableIngredients || []).join(", ")}</p>
                <p className="text-gray-400 text-sm mb-1">Processes: {(product.availableProcesses || []).join(", ")}</p>
                <p className="text-gray-400 text-sm mb-1">Equipment: {(product.availableEquipment || []).join(", ")}</p>
                <p className="text-gray-400 text-sm mb-1">Correct Order: {(product.correctOrder || []).join(", ")}</p>

                {user?.isAdmin && (
                  <div className="flex gap-2 mt-4 justify-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenModal(product); }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product); }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-lg text-white">
            <h2 className="text-2xl font-bold mb-4">{currentProduct ? 'Edit Product' : 'Add Product'}</h2>
            <div className="flex flex-col gap-3">
              <input type="text" placeholder="Product Name" name="name" value={formData.name} onChange={handleChange} className="p-2 rounded text-black" />
              <input type="text" placeholder="Image URL" name="image" value={formData.image} onChange={handleChange} className="p-2 rounded text-black" />
              <input type="text" placeholder="Ingredients (comma separated)" name="availableIngredients" value={Array.isArray(formData.availableIngredients) ? formData.availableIngredients.join(", ") : ""} onChange={handleChange} className="p-2 rounded text-black" />
              <input type="text" placeholder="Processes (comma separated)" name="availableProcesses" value={Array.isArray(formData.availableProcesses) ? formData.availableProcesses.join(", ") : ""} onChange={handleChange} className="p-2 rounded text-black" />
              <input type="text" placeholder="Equipment (comma separated)" name="availableEquipment" value={Array.isArray(formData.availableEquipment) ? formData.availableEquipment.join(", ") : ""} onChange={handleChange} className="p-2 rounded text-black" />
              <input type="text" placeholder="Correct Order (comma separated)" name="correctOrder" value={Array.isArray(formData.correctOrder) ? formData.correctOrder.join(", ") : ""} onChange={handleChange} className="p-2 rounded text-black" />

              <div className="flex justify-end gap-2 mt-4">
                <button onClick={handleCloseModal} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">Cancel</button>
                <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Products;
