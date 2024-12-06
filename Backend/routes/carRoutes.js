const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const protect = require('../middleware/authMiddleware');

router.post('/',carController.createCar);

// Récupérer toutes les voitures
router.get('/', protect, carController.getAllCars);
router.get('/filters', protect, carController.getCarsWithFilters);

router.get('/:voiture_id',protect, carController.getCarById);

router.put('/:voiture_id',protect, carController.updateCar);

router.delete('/:voiture_id',protect, carController.deleteCar);


module.exports = router;
