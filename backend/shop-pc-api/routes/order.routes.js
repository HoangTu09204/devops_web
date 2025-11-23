const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const vnpayController = require('../controllers/vnpay.controller');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

// === ORDER ROUTES ===
router.post('/', verifyToken, orderController.createOrder);
router.get('/my', verifyToken, orderController.getMyOrders);
router.get('/', verifyToken, verifyAdmin, orderController.getAllOrders);
router.put('/:id/status', verifyToken, verifyAdmin, orderController.updateOrderStatus);
router.get('/user/:userId', orderController.getOrdersByUser);

// === VNPAY ROUTES ===
router.post('/vnpay', verifyToken, vnpayController.createPaymentUrl);        
router.post('/vnpay/confirm', verifyToken, vnpayController.confirmVnpayReturn); 
router.get('/vnpay_ipn', vnpayController.vnpayIPN);                         

module.exports = router;
