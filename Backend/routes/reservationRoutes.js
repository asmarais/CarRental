const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Créer une réservation
router.post('/', reservationController.createReservation);

// Récupérer toutes les réservations
router.get('/', reservationController.getAllReservations);

// Correct Order:
router.get('/filters', reservationController.getReservationsWithFilters); // More specific path first
// Route pour générer un QR code pour une réservation
router.get('/:reservation_id/generateQrCode/:user_id/:voiture_id', reservationController.generateQrCode);


router.get('/:reservation_id', reservationController.getReservationById); // More general (parameterized) path later


// Correct Order:
router.get('/filters', reservationController.getReservationsWithFilters); // More specific path first
// Route pour générer un QR code pour une réservation
router.get('/:reservation_id/generateQrCode/:user_id/:voiture_id', reservationController.generateQrCode);


router.get('/:reservation_id', reservationController.getReservationById); // More general (parameterized) path later

router.get('/filters', reservationController.getReservationsWithFilters);

router.get('/:reservation_id', reservationController.getReservationById); 


router.put('/:reservation_id', reservationController.updateReservation);

router.delete('/:reservation_id', reservationController.deleteReservation);

router.get('/:reservation_id/generateQrCode/:user_id/:voiture_id', reservationController.generateQrCode);


module.exports = router;