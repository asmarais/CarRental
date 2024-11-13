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

// Fonction pour récupérer les réservations avec filtres facultatifs
exports.getReservationsWithFilters = async (req, res) => {
  try {
    const { 
      reservation_id, user_id, voiture_id, statut, date_debut, date_fin 
    } = req.query;

    // Objet de filtrage pour les réservations
    const reservationFilters = {};

    // Filtrage conditionnel avec validation
    if (reservation_id && !isNaN(Number(reservation_id))) {
      reservationFilters.reservation_id = Number(reservation_id);
    }

    if (user_id && !isNaN(Number(user_id))) {
      reservationFilters.user_id = Number(user_id);
    }

    if (voiture_id && !isNaN(Number(voiture_id))) {
      reservationFilters.voiture_id = Number(voiture_id);
    }

    if (statut !== undefined) {
      reservationFilters.statut = statut === 'true';
    }

    // Validation et ajout des filtres de dates si valides
    if (date_debut) {
      const dateDebutObj = new Date(date_debut);
      if (!isNaN(dateDebutObj)) {
        reservationFilters.date_debut = { $gte: dateDebutObj };
      }
    }

    if (date_fin) {
      const dateFinObj = new Date(date_fin);
      if (!isNaN(dateFinObj)) {
        reservationFilters.date_fin = { $lte: dateFinObj };
      }
    }

    // Recherche des réservations dans la base de données avec les filtres
    const reservations = await Reservation.find(reservationFilters);

    // Vérification si des réservations ont été trouvées
    if (reservations.length === 0) {
      return res.status(404).json({ error: 'Aucune réservation trouvée avec les filtres fournis' });
    }

    // Retour des réservations trouvées
    res.status(200).json({ reservations });
  } catch (err) {
    // Gestion d'erreur
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations', details: err.message });
  }
};
