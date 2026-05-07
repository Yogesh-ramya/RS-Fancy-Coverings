const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// @route   POST /api/orders
// @desc    Create new order
router.post('/', orderController.createOrder);

// @route   GET /api/orders
// @desc    Get all orders (Admin)
router.get('/', orderController.getOrders);

// @route   DELETE /api/orders/:id
// @desc    Delete order (Admin)
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
