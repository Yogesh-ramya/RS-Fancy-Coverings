const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware');

// @route   GET /api/products
// @desc    Get all products
router.get('/', productController.getProducts);

// @route   GET /api/products/:id
// @desc    Get single product
router.get('/:id', productController.getProductById);

// @route   POST /api/products
// @desc    Create product (Admin)
router.post('/', upload.array('images', 5), productController.createProduct);

// @route   PUT /api/products/:id
// @desc    Update product (Admin)
router.put('/:id', upload.array('images', 5), productController.updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin)
router.delete('/:id', productController.deleteProduct);

module.exports = router;
