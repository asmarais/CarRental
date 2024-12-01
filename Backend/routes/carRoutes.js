const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// Créer une voiture
router.post('/', carController.createCar);

// Récupérer toutes les voitures
router.get('/', carController.getAllCars);

// Récupérer une voiture par ID
router.get('/:voiture_id', carController.getCarById);

// Mettre à jour une voiture
router.put('/:voiture_id', carController.updateCar);

// Supprimer une voiture
router.delete('/:voiture_id', carController.deleteCar);

router.get('/filters', carController.getCarsWithFilters);

module.exports = router;
