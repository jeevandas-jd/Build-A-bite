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
  const [newStep, setNewStep] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const navigate = useNavigate();
  const [editingItem, setEditingItem] = useState({ field: null, index: null, value: null });
  const [activeTab, setActiveTab] = useState('available'); // 'available' or 'buffer'

  const emptyProduct = {
    name: '',
    description: '',
    image: '',
    availableIngredients: [],
    bufferIngredients: [],
    availableProcesses: [],
    bufferProcesses: [],
    availableEquipment: [],
    bufferEquipment: [],
    correctOrder: []
  };

  const [formData, setFormData] = useState(emptyProduct);

  useEffect(() => {
    fetchProducts();
    fetchUser();
  }, []);

  const fetchProducts = () => {
    axiosClient.get('/products')
      .then(async res => {
        const productsWithDetails = [];
        for (let i = 0; i < res.data.length; i++) {
          const productData = await axiosClient.get(`/products/${res.data[i]._id}`);
          productsWithDetails.push(productData.data);
        }

        const productsFixed = productsWithDetails.map(p => ({
          ...p,
          availableIngredients: Array.isArray(p.availableIngredients) ? p.availableIngredients : [],
          availableProcesses: Array.isArray(p.availableProcesses) ? p.availableProcesses : [],
          availableEquipment: Array.isArray(p.availableEquipment) ? p.availableEquipment : [],
          bufferEquipment: Array.isArray(p.bufferEquipment) ? p.bufferEquipment : [],
          bufferProcesses: Array.isArray(p.bufferProcesses) ? p.bufferProcesses : [],
          bufferIngredients: Array.isArray(p.bufferIngredients) ? p.bufferIngredients : [],
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
      setFormData({
        name: product.name || '',
        description: product.description || '',
        image: product.image || '',
        availableIngredients: [...(product.availableIngredients || [])],
        availableProcesses: [...(product.availableProcesses || [])],
        availableEquipment: [...(product.availableEquipment || [])],
        bufferIngredients: [...(product.bufferIngredients || [])],
        bufferProcesses: [...(product.bufferProcesses || [])],
        bufferEquipment: [...(product.bufferEquipment || [])],
        correctOrder: [...(product.correctOrder || [])]
      });
    } else {
      setFormData(emptyProduct);
    }
    setShowModal(true);
    setError('');
    setNewStep({});
    setActiveTab('available');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
    setFormData(emptyProduct);
    setError('');
    setNewStep({});
    setActiveTab('available');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddStep = (field) => {
    if (!newStep.name?.trim()) return;

    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], { name: newStep.name.trim(), description: newStep.description?.trim() || '' }]
    }));
    setNewStep({});
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
        res = await axiosClient.put(`/products/${currentProduct._id}`, formData);
        setProducts(prev => prev.map(p => p._id === res.data._id ? res.data : p));
      } else {
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
      setProducts(prev => prev.filter(p => p._id !== product._id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete product");
      console.error('Delete error:', err);
    }
  };

  const arrayToString = (arr) => {
    return Array.isArray(arr) ? arr.map(item => item.name || item).join(', ') : '';
  };

  const handleItemClick = (field, index, item) => {
    setEditingItem({ field, index, value: { ...item } });
  };

  const handleEditChange = (e, field) => {
    const { name, value } = e.target;
    setEditingItem(prev => ({
      ...prev,
      value: {
        ...prev.value,
        [name]: value
      }
    }));
  };

  const saveEdit = () => {
    if (editingItem.field !== null && editingItem.index !== null) {
      const updatedItems = [...formData[editingItem.field]];
      updatedItems[editingItem.index] = editingItem.value;
      
      setFormData(prev => ({
        ...prev,
        [editingItem.field]: updatedItems
      }));
      
      setEditingItem({ field: null, index: null, value: null });
    }
  };

  const cancelEdit = () => {
    setEditingItem({ field: null, index: null, value: null });
  };

  // Function to move items between available and buffer arrays
  const moveItemToBuffer = (sourceField, targetField, index) => {
    const sourceItems = [...formData[sourceField]];
    const targetItems = [...formData[targetField]];
    
    const [movedItem] = sourceItems.splice(index, 1);
    targetItems.push(movedItem);
    
    setFormData(prev => ({
      ...prev,
      [sourceField]: sourceItems,
      [targetField]: targetItems
    }));
  };

  const moveItemToAvailable = (sourceField, targetField, index) => {
    const sourceItems = [...formData[sourceField]];
    const targetItems = [...formData[targetField]];
    
    const [movedItem] = sourceItems.splice(index, 1);
    targetItems.push(movedItem);
    
    setFormData(prev => ({
      ...prev,
      [sourceField]: sourceItems,
      [targetField]: targetItems
    }));
  };

  const renderStepList = (field, bufferField, title) => (
    <div className="mb-6">
      <label className="block text-cyan-400 mb-2">{title}</label>
      
      {/* Tab Navigation */}
      <div className="flex mb-4 border-b border-cyan-400/30">
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'available' 
              ? 'text-cyan-400 border-b-2 border-cyan-400' 
              : 'text-gray-400 hover:text-cyan-300'
          }`}
          onClick={() => setActiveTab('available')}
        >
          Available
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'buffer' 
              ? 'text-purple-400 border-b-2 border-purple-400' 
              : 'text-gray-400 hover:text-purple-300'
          }`}
          onClick={() => setActiveTab('buffer')}
        >
          Buffer
        </button>
      </div>

      <div className="flex mb-2 gap-2">
        <input
          type="text"
          value={newStep.name || ''}
          onChange={(e) => setNewStep(prev => ({ ...prev, name: e.target.value }))}
          className="flex-grow p-2 rounded-l-xl border border-cyan-400/30 bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder={`Name`}
        />
        <input
          type="text"
          value={newStep.description || ''}
          onChange={(e) => setNewStep(prev => ({ ...prev, description: e.target.value }))}
          className="flex-grow p-2 border-t border-b border-cyan-400/30 bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="Description"
        />
        <button
          type="button"
          onClick={() => handleAddStep(activeTab === 'available' ? field : bufferField)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 rounded-r-xl transition-colors"
        >
          Add
        </button>
      </div>

      {/* Editing Input Box */}
      {editingItem.field === field && editingItem.index !== null && (
        <div className="bg-cyan-900/30 border border-cyan-400/50 rounded-xl p-3 mb-3">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              name="name"
              value={editingItem.value.name || ''}
              onChange={(e) => handleEditChange(e, field)}
              className="flex-grow p-2 rounded-xl border border-cyan-400/30 bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Name"
            />
            <input
              type="text"
              name="description"
              value={editingItem.value.description || ''}
              onChange={(e) => handleEditChange(e, field)}
              className="flex-grow p-2 rounded-xl border border-cyan-400/30 bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Description"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={cancelEdit}
              className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveEdit}
              className="px-3 py-1 rounded-lg bg-green-600 hover:bg-green-500 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Available Items */}
      {activeTab === 'available' && (
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
                onClick={() => handleItemClick(field, index, step)}
                className={`flex items-center justify-between p-2 rounded-lg mb-2 cursor-move transition-colors ${
                  editingItem.field === field && editingItem.index === index 
                    ? 'bg-cyan-600/50 border border-cyan-400/50' 
                    : 'bg-gray-600/50 hover:bg-gray-500/50'
                }`}
              >
                <div>
                  <span className="text-cyan-400 mr-2">↕</span>
                  <span className="font-bold">{step.name}</span>
                  {step.description && <span className="text-gray-300 ml-2">- {step.description}</span>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveItemToBuffer(field, bufferField, index);
                    }}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                    title="Move to Buffer"
                  >
                    ➤
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveStep(field, index);
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Buffer Items */}
      {activeTab === 'buffer' && (
        <div className="bg-purple-700/30 rounded-xl p-3 min-h-20 max-h-40 overflow-y-auto">
          {formData[bufferField].length === 0 ? (
            <p className="text-gray-400 text-center py-4">No buffer items added yet</p>
          ) : (
            formData[bufferField].map((step, index) => (
              <div
                key={index}
                onClick={() => handleItemClick(bufferField, index, step)}
                className={`flex items-center justify-between p-2 rounded-lg mb-2 transition-colors ${
                  editingItem.field === bufferField && editingItem.index === index 
                    ? 'bg-purple-600/50 border border-purple-400/50' 
                    : 'bg-purple-600/30 hover:bg-purple-500/30'
                }`}
              >
                <div>
                  <span className="text-purple-400 mr-2">ⓑ</span>
                  <span className="font-bold">{step.name}</span>
                  {step.description && <span className="text-gray-300 ml-2">- {step.description}</span>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveItemToAvailable(bufferField, field, index);
                    }}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    title="Move to Available"
                  >
                    ↶
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveStep(bufferField, index);
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6 font-mono relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse-slow delay-1000"></div>

      <div className="relative z-10">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6 text-center animate-title-glow">
          AVAILABLE PRODUCTS
        </h2>
        
        {user?.isAdmin ? (
          <FarmGuide message="Hello admin, this is your place to perform create, update, and delete operations on the products database." />
        ) : (
          <FarmGuide message="Explore all products and build what you want. Admin users can manage products." />
        )}
        
        {user?.isAdmin && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white px-5 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative">+ Add New Product</span>
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
                  
                  {product.description && (
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="text-gray-400 text-sm space-y-1 mb-3">
                    <p><span className="text-cyan-400">Ingredients:</span> {arrayToString(product.availableIngredients)}</p>
                    <p><span className="text-purple-400">Processes:</span> {arrayToString(product.availableProcesses)}</p>
                    <p><span className="text-pink-400">Equipment:</span> {arrayToString(product.availableEquipment)}</p>
                    <p><span className="text-green-400">Buffer Items:</span> {arrayToString([...product.bufferIngredients, ...product.bufferProcesses, ...product.bufferEquipment])}</p>
                    <p><span className="text-green-400">Correct Order:</span> {arrayToString(product.correctOrder)}</p>
                  </div>
                </div>

                {user?.isAdmin && (
                  <div className="flex gap-2 mt-4 justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(product);
                      }}
                      className="cursor-pointer bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleDeleteProduct(product); 
                      }}
                      className="cursor-pointer bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gray-800 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-white font-mono relative">
            {/* Modal glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/10 via-purple-400/10 to-pink-400/10 opacity-30 blur-xl"></div>
            
            <div className="relative">
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
                  <label className="block text-cyan-400 mb-1">Product Description</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    className="w-full p-3 rounded-xl border border-cyan-400/30 bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 min-h-[100px]"
                    placeholder="Enter product description"
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
                
                {renderStepList('availableIngredients', 'bufferIngredients', 'Ingredients')}
                {renderStepList('availableProcesses', 'bufferProcesses', 'Processes')}
                {renderStepList('availableEquipment', 'bufferEquipment', 'Equipment')}
                {renderStepList('correctOrder', 'correctOrder', 'Correct Order (Drag to reorder)')}

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
            
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700/60 text-gray-400 hover:text-white hover:bg-gray-600/60 transition-all duration-200"
              aria-label="Close"
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fade-in { 
          from { opacity: 0; transform: scale(0.95) translateY(10px); } 
          to { opacity: 1; transform: scale(1) translateY(0); } 
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        
        @keyframes title-glow {
          0%, 100% { text-shadow: 0 0 10px rgba(34, 211, 238, 0.4), 0 0 20px rgba(147, 51, 234, 0.3); }
          50% { text-shadow: 0 0 15px rgba(34, 211, 238, 0.6), 0 0 30px rgba(147, 51, 234, 0.5); }
        }
        
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-title-glow { animation: title-glow 3s ease-in-out infinite; }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default Products;