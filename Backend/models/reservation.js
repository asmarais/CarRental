// models/reservationModel.js
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Schéma de la réservation
const reservationSchema = new mongoose.Schema({
  reservation_id: { type: Number},
  date_debut: { type: Date, required: true },
  date_fin: { type: Date, required: true },
  user_id: { type: Number, required: true },  // ID du client
  voiture_id: { type: Number, required: true }, // ID de la voiture
  date_de_creation: { type: Date, default: Date.now },
  statut: { type: Boolean, default: true },  // true = actif, false = annulé
  avis: { type: String, default: '' },
  rate :{type:Number ,default:0},
  token_qr: { type: String, default: '' },
});
// Auto-increment for user_id
reservationSchema.plugin(AutoIncrement, { inc_field: 'reservation_id' });

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
