// controllers/carController.js
const Car = require('../models/car');

// Créer une nouvelle voiture
exports.createCar = async (req, res) => {
  try {
    const { voiture_id, marque, annee, modele, type, immatriculation, prix_par_jour, prix_par_heure, statut, agence_id } = req.body;
    
    const newCar = new Car({
      voiture_id,
      marque,
      annee,
      modele,
      type,
      immatriculation,
      prix_par_jour,
      prix_par_heure,
      statut,
      agence_id
    });

    await newCar.save();
    res.status(201).json({ message: 'Voiture créée avec succès', car: newCar });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Récupérer toutes les voitures
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Récupérer une voiture par ID
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findOne({ voiture_id: req.params.voiture_id });
    if (!car) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }
    res.status(200).json(car);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Mettre à jour une voiture
exports.updateCar = async (req, res) => {
  try {
    const updatedCar = await Car.findOneAndUpdate(
      { voiture_id: req.params.voiture_id },
      req.body,
      { new: true }
    );
    if (!updatedCar) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }
    res.status(200).json({ message: 'Voiture mise à jour', car: updatedCar });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer une voiture
exports.deleteCar = async (req, res) => {
  try {
    const deletedCar = await Car.findOneAndDelete({ voiture_id: req.params.voiture_id });
    if (!deletedCar) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }
    res.status(200).json({ message: 'Voiture supprimée' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
