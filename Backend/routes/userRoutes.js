const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');


router.post('/', protect, userController.createUser);

router.get('/:user_id', protect, userController.getUserById);

router.get('/', protect, userController.getAllUsers);

router.put('/:user_id', protect, userController.updateUserById);

router.delete('/:user_id', protect, userController.deleteUserById);

module.exports = router;
