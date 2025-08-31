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
  const [error, setError] = useState('');
  const [newStep, setNewStep] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
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
    fetchProducts();
    fetchUser();
  }, []);

  const fetchProducts = () => {
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
  };

  const fetchUser = () => {
    axiosClient.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  };

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
    if (product) {
      // Deep clone the product to avoid reference issues
      setFormData({
        name: product.name || '',
        image: product.image || '',
        availableIngredients: [...(product.availableIngredients || [])],
        availableProcesses: [...(product.availableProcesses || [])],
        availableEquipment: [...(product.availableEquipment || [])],
        correctOrder: [...(product.correctOrder || [])]
      });
    } else {
      setFormData(emptyProduct);
    }
    setShowModal(true);
    setError('');
    setNewStep('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
    setFormData(emptyProduct);
    setError('');
    setNewStep('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddStep = (field) => {
    if (!newStep.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], newStep.trim()]
    }));
    setNewStep('');
  };

  const handleRemoveStep = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleDragStart = (e, field, index) => {
    setDraggedItem({ field, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, field, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, field, targetIndex) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    const { field: sourceField, index: sourceIndex } = draggedItem;
    if (sourceField !== field) return;
    
    const items = [...formData[field]];
    const [movedItem] = items.splice(sourceIndex, 1);
    items.splice(targetIndex, 0, movedItem);
    
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
    
    setDraggedItem(null);
  };

  const handleSubmit = async () => {
    try {
      let res;
      if (currentProduct) {
        // Update existing product
        res = await axiosClient.put(`/products/${currentProduct._id}`, formData);
        setProducts(prev => prev.map(p => p._id === res.data._id ? res.data : p));
      } else {
        // Create new product
        res = await axiosClient.post('/products', formData);
        setProducts(prev => [...prev, res.data]);
      }
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product');
      console.error('Save error:', err);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) return;
    
    try {
      await axiosClient.delete(`/products/${product._id}`);
      // Remove the product from the local state
      setProducts(prev => prev.filter(p => p._id !== product._id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete product");
      console.error('Delete error:', err);
    }
  };

  const arrayToString = (arr) => {
    return Array.isArray(arr) ? arr.join(', ') : '';
  };

  const renderStepList = (field, title) => (
    <div className="mb-4">
      <label className="block text-cyan-400 mb-2">{title}</label>
      <div className="flex mb-2">
        <input
          type="text"
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
          className="flex-grow p-2 rounded-l-xl border border-cyan-400/30 bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder={`Add new ${field.toLowerCase().replace('available', '')}`}
          onKeyPress={(e) => e.key === 'Enter' && handleAddStep(field)}
        />
        <button
          type="button"
          onClick={() => handleAddStep(field)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 rounded-r-xl transition-colors"
        >
          Add
        </button>
      </div>
      
      <div className="bg-gray-700/50 rounded-xl p-3 min-h-20 max-h-40 overflow-y-auto">
        {formData[field].length === 0 ? (
          <p className="text-gray-400 text-center py-4">No items added yet</p>
        ) : (
          formData[field].map((step, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, field, index)}
              onDragOver={(e) => handleDragOver(e, field, index)}
              onDrop={(e) => handleDrop(e, field, index)}
              className="flex items-center justify-between bg-gray-600/50 p-2 rounded-lg mb-2 cursor-move hover:bg-gray-500/50 transition-colors"
            >
              <span className="flex items-center">
                <span className="text-cyan-400 mr-2">↕</span>
                {step}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveStep(field, index)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6 font-mono relative overflow-hidden">

      <div className="relative z-10">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6 text-center">
          QUANTUM SYNTHESIS PROTOCOLS
        </h2>

        <FarmGuide message="Explore all products and build what you want. Admin users can manage products." />

        {user?.isAdmin && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white px-5 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
            >
              + Add New Product
            </button>
          </div>
        )}

        {products.length === 0 ? (
          <div className="bg-gray-800/70 backdrop-blur-xl border border-red-400/40 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl text-red-400 font-bold mb-2">NO PRODUCTS FOUND</h3>
            <p className="text-gray-400">No synthesis protocols available. {user?.isAdmin && 'Add a new product to get started.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {products.map(product => (
              <div 
                key={product._id}
                className="bg-gray-800/60 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-5 shadow-lg hover:shadow-cyan-400/20 hover:scale-105 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-cyan-400/20 text-cyan-400 text-xs px-2 py-1 rounded-full uppercase font-bold">
                  ID: {product._id.slice(-4)}
                </div>

                <div 
                  onClick={() => navigate(`/game/${product._id}`)}
                  className="cursor-pointer"
                >
                  <div className="mb-4 rounded-xl overflow-hidden border border-cyan-400/20 group-hover:border-cyan-400/40 transition-all duration-300">
                    <img src={product.image} alt={product.name} className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
                    {product.name}
                  </h3>

                  <div className="text-gray-400 text-sm space-y-1 mb-3">
                    <p><span className="text-cyan-400">Ingredients:</span> {arrayToString(product.availableIngredients)}</p>
                    <p><span className="text-purple-400">Processes:</span> {arrayToString(product.availableProcesses)}</p>
                    <p><span className="text-pink-400">Equipment:</span> {arrayToString(product.availableEquipment)}</p>
                    <p><span className="text-green-400">Correct Order:</span> {arrayToString(product.correctOrder)}</p>
                  </div>
                </div>

                {user?.isAdmin && (
                  <div className="flex gap-2 mt-4 justify-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenModal(product); }}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product); }}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-white font-mono">
            <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              {currentProduct ? `EDIT PRODUCT: ${currentProduct.name}` : 'CREATE NEW PRODUCT'}
            </h2>
            
            {error && (
              <div className="bg-red-500/20 border border-red-400 text-red-300 p-3 mb-4 rounded-xl">
                <p className="font-bold">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-cyan-400 mb-1">Product Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className="w-full p-3 rounded-xl border border-cyan-400/30 bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <label className="block text-cyan-400 mb-1">Image URL</label>
                <input 
                  type="text" 
                  name="image" 
                  value={formData.image} 
                  onChange={handleInputChange} 
                  className="w-full p-3 rounded-xl border border-cyan-400/30 bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Enter image URL"
                />
              </div>
              
              {renderStepList('availableIngredients', 'Ingredients')}
              {renderStepList('availableProcesses', 'Processes')}
              {renderStepList('availableEquipment', 'Equipment')}
              {renderStepList('correctOrder', 'Correct Order (Drag to reorder)')}

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={handleCloseModal} 
                  className="px-5 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit} 
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 transition-colors"
                >
                  {currentProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Products;