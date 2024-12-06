const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController')
const protect = require('../middleware/authMiddleware');


router.post('/', protect, paymentController.Add)
router.post("/:id", protect, paymentController.Verify)

module.exports = router;
