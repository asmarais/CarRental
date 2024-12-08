const mongoose = require('mongoose');
const { type } = require('os');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const carSchema = new mongoose.Schema({
  voiture_id: { type: Number },
  marque: { type: String, required: true },
  annee: { type: Number, required: true },
  modele: { type: String, required: true },
  type: { type: String, required: true },
  immatriculation: { type: String, required: true, unique: true },
  prix_par_jour: { type: Number, required: true },
  prix_par_mois: { type: Number, required: true },
  statut: { type: Boolean, default: true },  // true = disponible, false = non disponible
  pik_up_position: { type: String, required: true }, 
  pik_off_position: { type: String, required: true } ,
  image : { type:String },


});

carSchema.plugin(AutoIncrement, { inc_field: 'voiture_id' });

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
