// models/Product.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String }, // URL
  availableIngredients: [{ type: String }],
  availableProcesses: [{ type: String }],
  availableEquipment: [{ type: String }],
  correctOrder: [{ type: String }],
  // Sequence for completion

  createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
