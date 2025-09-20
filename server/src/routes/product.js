const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth');
// Get list of all products
router.get('/', productController.getProducts);

// Get product details by name or id
router.get('/:id', productController.getProduct);

// Get instructions for a specific difficulty
router.get('/instructions/:difficulty', productController.getInstructions);


// (Optional CRUD routes for product creation/update, admin only)
router.post('/',productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.delete('/', productController.deleteAllProducts);
module.exports = router;
    