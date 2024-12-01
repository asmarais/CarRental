// controllers/carController.js
const Car = require('../models/car');
// Créer une nouvelle voiture
exports.createCar = async (req, res) => {
  try {
    const { marque, annee, modele, type, immatriculation, prix_par_jour, prix_par_mois, statut,pik_up_position,pik_off_position } = req.body;
    
    const newCar = new Car({
      marque,
      annee,
      modele,
      type,
      immatriculation,
      prix_par_mois,
      prix_par_jour,
      statut,
      pik_up_position,
      pik_off_position
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
exports.getCarsWithFilters = async (req, res) => {
    try {
      const { 
        voiture_id, marque, type, statut, prix_par_mois, prix_par_jour, agence_id, modele, annee 
      } = req.query;
  
      // Filter for cars
      const carFilters = {};
  
      if (voiture_id) carFilters.voiture_id = voiture_id;
      if (marque) carFilters.marque = { $regex: marque, $options: 'i' }; 
      if (type) carFilters.type = { $regex: type, $options: 'i' };
      if (modele) carFilters.modele = { $regex: modele, $options: 'i' };
      if (annee) carFilters.annee = Number(annee); 
  
      if (statut !== undefined) carFilters.statut = statut === 'true'; 
      if (prix_par_mois) carFilters.prix_par_mois = { $gte: Number(prix_par_mois) }; // Filter cars with price >= prix_par_jour
      if (prix_par_jour) carFilters.prix_par_jour = { $gte: Number(prix_par_jour) }; // Filter cars with price >= prix_par_heure
      //if (agence_id) carFilters.agence_id = Number(agence_id);
  
      // Fetch cars based on carFilters
      const cars = await Car.find(carFilters);
  
      if (cars.length === 0) {
        return res.status(404).json({ error: 'No cars found with the given filters' });
      }
  
      res.status(200).json({ cars });
    } catch (err) {
      res.status(500).json({ error: 'Error fetching cars', details: err.message });
    }
  };
  