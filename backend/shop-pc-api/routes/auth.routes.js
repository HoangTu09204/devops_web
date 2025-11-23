const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/', authController.getAllUsers);
router.put('/:id', authController.updateUser);         // ✅ Cập nhật người dùng
router.delete('/:id', authController.deleteUser);    
router.get('/:id', authController.getUserById);

module.exports = router;
