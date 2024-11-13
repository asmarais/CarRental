// routes/carRoutes.js
const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// Créer une voiture
router.post('/cars', carController.createCar);

// Récupérer toutes les voitures
router.get('/cars', carController.getAllCars);

// Récupérer une voiture par ID
router.get('/cars/:voiture_id', carController.getCarById);

// Mettre à jour une voiture
router.put('/cars/:voiture_id', carController.updateCar);

// Supprimer une voiture
router.delete('/cars/:voiture_id', carController.deleteCar);

module.exports = router;
