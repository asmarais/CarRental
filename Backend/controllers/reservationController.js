const Reservation = require('../models/reservation');

// Créer une nouvelle réservation
exports.createReservation = async (req, res) => {
  try {
    const { reservation_id, date_debut, date_fin, user_id, voiture_id, statut, avis,rate, token_qr } = req.body;

    // Créer une nouvelle réservation
    const newReservation = new Reservation({
      reservation_id,
      date_debut,
      date_fin,
      user_id,
      voiture_id,
      statut,
      avis,
      rate,
      token_qr,
    });

    await newReservation.save();
    res.status(201).json({ message: 'Réservation créée avec succès', reservation: newReservation });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Récupérer toutes les réservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Récupérer une réservation par ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ reservation_id: req.params.reservation_id });
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.status(200).json(reservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Mettre à jour une réservation
exports.updateReservation = async (req, res) => {
  try {
    const updatedReservation = await Reservation.findOneAndUpdate(
      { reservation_id: req.params.reservation_id },
      req.body,
      { new: true }
    );
    if (!updatedReservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.status(200).json({ message: 'Réservation mise à jour', reservation: updatedReservation });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  try {
    const deletedReservation = await Reservation.findOneAndDelete({ reservation_id: req.params.reservation_id });
    if (!deletedReservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.status(200).json({ message: 'Réservation supprimée' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// controllers/reservationController.js
const QRCode = require('../utils/tokenService');

exports.generateQrCode = async (req, res) => {
  const { reservation_id, user_id, voiture_id } = req.params;

  try {
    // Vérifier si la réservation existe avec les trois paramètres (reservation_id, user_id, voiture_id)
    const reservation = await Reservation.findOne({
      reservation_id:reservation_id,
      user_id:user_id,
      voiture_id:voiture_id,
    });

    if (!reservation) {
      return res.status(404).json({
        error: 'Réservation non trouvée ou invalide avec les identifiants fournis.'
      });
    }

    // Créer un token unique pour la réservation
    const token = QRCode.generateQR(reservation_id, user_id, voiture_id);

    // Retourner le QR code sous forme d'URL de l'image
    res.status(200).json({
      message: 'QR code généré avec succès',
      token_qr: token,  // Le token pour référence
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la génération du QR code', details: err.message });
  }
};

const logger = console; // Basic logger (can be replaced with more sophisticated logging library)

exports.getReservationsWithFilters = async (req, res) => {
  try {
    const { 
      reservation_id, user_id, voiture_id, statut, date_debut, date_fin ,rate
    } = req.query;

    // Create the filter object for reservations
    const reservationFilters = {};

    // Apply filters if they are provided in the query string
    if (reservation_id) reservationFilters.reservation_id = Number(reservation_id);
    if (user_id) reservationFilters.user_id = Number(user_id);
    if (voiture_id) reservationFilters.voiture_id = Number(voiture_id);
    if (rate) reservationFilters.rate = Number(rate);

    // Filter for status (true/false)
    if (statut !== undefined) reservationFilters.statut = statut === 'true';

    // Filter for date_debut if provided
    if (date_debut) {
      const dateDebutObj = new Date(date_debut);
      if (!isNaN(dateDebutObj)) {
        reservationFilters.date_debut = { $gte: dateDebutObj };
      } else {
        return res.status(400).json({ error: 'Invalid date_debut value' });
      }
    }

    // Filter for date_fin if provided
    if (date_fin) {
      const dateFinObj = new Date(date_fin);
      if (!isNaN(dateFinObj)) {
        reservationFilters.date_fin = { $lte: dateFinObj };
      } else {
        return res.status(400).json({ error: 'Invalid date_fin value' });
      }
    }

    // Fetch reservations based on the filters
    const reservations = await Reservation.find(reservationFilters);

    // If no reservations match the filters
    if (reservations.length === 0) {
      return res.status(404).json({ error: 'No reservations found with the given filters' });
    }

    // Return the found reservations
    res.status(200).json({ reservations });
  } catch (err) {
    // Error handling
    console.error('Error fetching reservations:', err);
    res.status(500).json({ error: 'Error fetching reservations', details: err.message });
  }
};
