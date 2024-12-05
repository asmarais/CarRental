const Car = require('../models/car');

// Créer une nouvelle voiture
exports.createCar = async (req, res) => {
  try {
    const { marque, annee, modele, type, immatriculation, prix_par_jour, prix_par_mois, statut,pik_up_position,pik_off_position, image } = req.body;

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
      pik_off_position,
      image
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
    const updateData = { ...req.body };

    const updatedCar = await Car.findOneAndUpdate(
      { voiture_id: req.params.voiture_id },
      updateData,
      { new: true }
    );
    if (!updatedCar) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }
    res.status(200).json({
      message: 'Voiture mise à jour',
      car: updatedCar,
    });
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

// Récupérer les voitures avec des filtres
exports.getCarsWithFilters = async (req, res) => {
  try {
    const { 
      voiture_id, marque, type, statut, prix_par_mois, prix_par_jour, modele, annee 
    } = req.query;

    // Build the filters object
    const carFilters = {};

    if (voiture_id) carFilters.voiture_id = voiture_id;
    if (marque) carFilters.marque = { $regex: marque, $options: 'i' }; // Case-insensitive
    if (type) carFilters.type = { $regex: type, $options: 'i' }; // Case-insensitive
    if (modele) carFilters.modele = { $regex: modele, $options: 'i' }; // Case-insensitive
    if (annee) carFilters.annee = Number(annee); // Convert to number

    if (statut !== undefined) carFilters.statut = statut === 'true'; // Convert to boolean
    if (prix_par_mois) carFilters.prix_par_mois = { $gte: Number(prix_par_mois) }; // Minimum value
    if (prix_par_jour) carFilters.prix_par_jour = { $gte: Number(prix_par_jour) }; // Minimum value

    // Fetch the cars from the database
    const cars = await Car.find(carFilters);

    if (!cars || cars.length === 0) {
      return res.status(404).json({ error: 'No cars found with the given filters' });
    }

    // Return the cars directly
    res.status(200).json(cars.map(car => car.toObject()));
  } catch (err) {
    res.status(500).json({ error: 'Error fetching cars', details: err.message });
  }
};

