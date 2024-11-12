// controllers/reservationController.js
const Reservation = require('../models/reservation');

// Créer une nouvelle réservation
exports.createReservation = async (req, res) => {
  try {
    const { reservation_id, date_debut, date_fin, user_id, voiture_id, statut, avis, token_qr } = req.body;

    // Créer une nouvelle réservation
    const newReservation = new Reservation({
      reservation_id,
      date_debut,
      date_fin,
      user_id,
      voiture_id,
      statut,
      avis,
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
const QRCode = require('qrcode');

// Générer le QR code pour une réservation
exports.generateQrCode = async (req, res) => {
  const { reservation_id, user_id, voiture_id } = req.params;

  // Créer un token unique pour la réservation
  const token = `${reservation_id}-${user_id}-${voiture_id}-${Date.now()}`;

  try {
    // Générer le QR code à partir du token
    const qrCodeDataUrl = await QRCode.toDataURL(token);

    // Retourner le QR code sous forme d'URL de l'image
    res.status(200).json({
      message: 'QR code généré avec succès',
      token_qr: token,  // Le token pour référence
      qr_code: qrCodeDataUrl,  // URL du QR code au format base64
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la génération du QR code', details: err.message });
  }
};
