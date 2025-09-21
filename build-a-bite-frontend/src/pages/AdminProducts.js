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


const fetchProducts=()=>{
  axiosClient.get('/products')
}

}
