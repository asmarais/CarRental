const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const protect = require('../middleware/authMiddleware');


router.post('/', protect, reservationController.createReservation);

router.get('/', protect, reservationController.getAllReservations);

router.get('/filters', protect, reservationController.getReservationsWithFilters);

router.get('/:reservation_id', protect, reservationController.getReservationById); 

router.put('/:reservation_id', protect, reservationController.updateReservation);

router.delete('/:reservation_id', protect, reservationController.deleteReservation);

router.get('/:reservation_id/generateQrCode/:user_id/:voiture_id', protect, reservationController.generateQrCode);


module.exports = router;
