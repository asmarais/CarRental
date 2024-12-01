const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController')

router.post('/', paymentController.Add)
router.post("/:id", paymentController.Verify)

module.exports = router;
