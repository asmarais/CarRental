const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  voiture_id: { type: String, required: true, unique: true },
  marque: { type: String, required: true },
  annee: { type: Number, required: true },
  modele: { type: String, required: true },
  type: { type: String, required: true },
  immatriculation: { type: String, required: true, unique: true },
  prix_par_jour: { type: Number, required: true },
  prix_par_heure: { type: Number, required: true },
  statut: { type: Boolean, default: true },  // true = disponible, false = non disponible
  agence_id: { type: String, required: true }
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
