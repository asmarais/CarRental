// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// GET all items
router.get('/', itemController.getAllItems);

// POST create a new item
router.post('/', itemController.createItem);

module.exports = router;
