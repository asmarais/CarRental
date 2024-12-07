const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController')
const protect = require('../middleware/authMiddleware');


router.post('/', paymentController.Add)
router.post("/:id", paymentController.Verify)

module.exports = router;
