const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Reusable sub-schema for name + description
const itemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" } // optional
}, { _id: false });

const productSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String }, // URL

  availableIngredients: [
    {
      name: { type: String, required: true },
      description: { type: String, default: "" } // optional
    }
  ],
  bufferIngredients: [
    {
      name: String,
      description: { type: String, default: "" }
    }
  ],

  availableProcesses: [
    {
      name: { type: String, required: true },
      description: { type: String, default: "" }
    }
  ],
  bufferProcesses: [
    {
      name: String,
      description: { type: String, default: "" }
    }
  ],

  availableEquipment: [
    {
      name: { type: String, required: true },
      description: { type: String, default: "" }
    }
  ],
  bufferEquipment: [
    {
      name: String,
      description: { type: String, default: "" }
    }
  ],

  correctOrder: [{ type: String }],

  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
