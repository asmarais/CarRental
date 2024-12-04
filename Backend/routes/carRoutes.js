const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const protect = require('../middleware/authMiddleware');

router.post('/',protect, carController.uploadImage ,carController.createCar);

router.get('/', protect, carController.getAllCars);

router.get('/:voiture_id',protect, carController.getCarById);

router.put('/:voiture_id',protect, carController.updateCar);

router.delete('/:voiture_id',protect, carController.deleteCar);

router.get('/filters', protect, carController.getCarsWithFilters);

module.exports = router;
