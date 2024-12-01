const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Créer une réservation
router.post('/', reservationController.createReservation);

// Récupérer toutes les réservations
router.get('/', reservationController.getAllReservations);

// Correct Order:
router.get('/filters', reservationController.getReservationsWithFilters); // More specific path first
router.get('/:reservation_id', reservationController.getReservationById); // More general (parameterized) path later

// Mettre à jour une réservation
router.put('/:reservation_id', reservationController.updateReservation);

// Supprimer une réservation
router.delete('/:reservation_id', reservationController.deleteReservation);

// Route pour générer un QR code pour une réservation
router.get('/:reservation_id/generateQrCode/:user_id/:voiture_id', reservationController.generateQrCode);


module.exports = router;
