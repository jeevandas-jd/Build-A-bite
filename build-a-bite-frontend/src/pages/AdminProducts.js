import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

function AdminProducts() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: "", image: "" });
  const navigate = useNavigate();

  // Fetch user info
  useEffect(() => {
    axiosClient.get("/auth/me")
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  // Fetch products
  useEffect(() => {
    axiosClient.get("/products")
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => setProducts([]));
  }, []);

  if (!user) return <p>Loading user info...</p>;
  if (!user.isAdmin) return <p className="text-red-500 text-center mt-10 text-xl">Access Denied: Admins Only</p>;

  // Open create modal
  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", image: "" });
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, image: product.image });
    setShowModal(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form (create/update)
  const handleSubmit = () => {
    if (editingProduct) {
      // Update product
      axiosClient.put(`/products/${editingProduct._id}`, formData)
        .then(res => {
          setProducts(products.map(p => p._id === editingProduct._id ? res.data : p));
          setShowModal(false);
        })
        .catch(err => console.error(err));
    } else {
      // Create product
      axiosClient.post("/products", formData)
        .then(res => {
          setProducts([...products, res.data]);
          setShowModal(false);
        })
        .catch(err => console.error(err));
    }
  };

  // Delete product
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axiosClient.delete(`/products/${id}`)
        .then(() => setProducts(products.filter(p => p._id !== id)))
        .catch(err => console.error(err));
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-cyan-400">
      <p>Loading products...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white font-mono">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Admin Product Management</h2>
        <button 
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
          onClick={openCreateModal}
        >
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-gray-800 p-4 rounded-lg relative shadow-lg">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded mb-3" />
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            <div className="flex justify-between mt-4">
              <button 
                className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => openEditModal(product)}
              >
                Edit
              </button>
              <button 
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-2xl font-bold mb-4">{editingProduct ? "Edit Product" : "Add Product"}</h3>
            <input 
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 mb-3 rounded bg-gray-700 border border-gray-600"
            />
            <input 
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 mb-3 rounded bg-gray-700 border border-gray-600"
            />
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
                onClick={handleSubmit}
              >
                {editingProduct ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
