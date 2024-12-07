const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const protect = require('../middleware/authMiddleware');


router.post('/', protect, reservationController.createReservation);

// Correct Order:
router.get('/filters', reservationController.getReservationsWithFilters); // More specific path first
// Route pour générer un QR code pour une réservation
router.get('/:reservation_id/generateQrCode/:user_id/:voiture_id', reservationController.generateQrCode);


router.get('/:reservation_id', reservationController.getReservationById); // More general (parameterized) path later

router.get('/filters', protect, reservationController.getReservationsWithFilters);

router.get('/:reservation_id', protect, reservationController.getReservationById); 


router.put('/:reservation_id', protect, reservationController.updateReservation);

router.delete('/:reservation_id', protect, reservationController.deleteReservation);

router.get('/:reservation_id/generateQrCode/:user_id/:voiture_id', protect, reservationController.generateQrCode);


module.exports = router;
