const bcrypt = require('bcryptjs');
const { User } = require('../models/userModel');

// Create User
const createUser = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, numero_de_telephone, adresse, cin, role} = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const user = new User({
      nom,
      prenom,
      email,
      mot_de_passe,
      numero_de_telephone,
      adresse,
      cin,
      role,
    });

    const salt = await bcrypt.genSalt(10);
    user.mot_de_passe = await bcrypt.hash(mot_de_passe, salt);

    await user.save();
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
    try {
      const user = await User.findOne({ user_id: req.params.user_id });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Get all Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update User by ID
const updateUserById = async (req, res) => {
  try {
    const { nom, prenom, mot_de_passe, numero_de_telephone, adresse, cin } = req.body;

    const user = await User.findOne({ user_id: req.params.user_id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.nom = nom || user.nom;
    user.prenom = prenom || user.prenom;
    user.mot_de_passe = mot_de_passe || user.mot_de_passe;
    user.numero_de_telephone = numero_de_telephone || user.numero_de_telephone;
    user.adresse = adresse || user.adresse;
    user.cin = cin || user.cin;

    if (mot_de_passe) {
      const salt = await bcrypt.genSalt(10);
      user.mot_de_passe = await bcrypt.hash(mot_de_passe, salt);
    }

    await user.save();
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete User by ID
const deleteUserById = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ user_id: req.params.user_id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUserById,
  deleteUserById,
};
