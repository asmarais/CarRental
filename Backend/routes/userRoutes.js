const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Create User
router.post('/', userController.createUser);

// Get User by ID
router.get('/:user_id', userController.getUserById);

// Get all Users
router.get('/', userController.getAllUsers);

// Update User by ID
router.put('/:user_id', userController.updateUserById);

// Delete User by ID
router.delete('/:user_id', userController.deleteUserById);

module.exports = router;
