// models/reservationModel.js
const mongoose = require('mongoose');

// Schéma de la réservation
const reservationSchema = new mongoose.Schema({
  reservation_id: { type: String, required: true, unique: true },
  date_debut: { type: Date, required: true },
  date_fin: { type: Date, required: true },
  user_id: { type: String, required: true },  // ID du client
  voiture_id: { type: String, required: true }, // ID de la voiture
  date_de_creation: { type: Date, default: Date.now },
  statut: { type: Boolean, default: true },  // true = actif, false = annulé
  avis: { type: String, default: '' },
  token_qr: { type: String, default: '' },
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
