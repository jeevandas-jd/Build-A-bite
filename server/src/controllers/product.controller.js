const Product = require('../models/Product');

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().select('name image');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/products/:id
exports.getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    // You can choose to query by _id or by product name
    let product = await Product.findById(id);
    if (!product) {
      product = await Product.findOne({ name: id });
    }
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
// -------------------------for admin only-------------------------


exports.createProduct = async (req, res) => {
  if (false) {
    return res.status(403).json({ error: 'Admin only' });
  }
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: 'Could not create product' });
  }
};

exports.updateProduct = async (req, res) => {
  if (false) {
    return res.status(403).json({ error: 'Admin only' });
  }
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Update failed' });
  }
};

exports.deleteProduct = async (req, res) => {
  if (false) {
    return res.status(403).json({ error: 'Admin only' });
  }
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Delete failed' });
  }
};

// GET /api/products/instructions/:difficulty
const instructions = {
  beginner: 'Beginner instructions...',
  intermediate: 'Intermediate instructions...',
  expert: 'Expert instructions...'
};

exports.getInstructions = (req, res) => {
  const difficulty = req.params.difficulty.toLowerCase();
  if (!instructions[difficulty]) {
    return res.status(404).json({ error: 'Invalid difficulty level' });
  }
  res.json({ difficulty, instructions: instructions[difficulty] });
};
