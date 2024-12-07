const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const protect = require('../middleware/authMiddleware');

router.post('/',carController.createCar);

router.get('/', carController.getAllCars);
router.get('/filters', carController.getCarsWithFilters);

router.get('/:voiture_id', carController.getCarById);

router.put('/:voiture_id', carController.updateCar);

router.delete('/:voiture_id', carController.deleteCar);


module.exports = router;
