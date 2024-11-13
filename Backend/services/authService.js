// services/authService.js
const bcrypt = require('bcryptjs');
const { User } = require('../models/userModel');
const { generateToken } = require('../utils/tokenService');
const { sendEmail } = require('../utils/emailService');

// Signup Service
const signup = async (userData) => {
  const { nom, prenom, email, mot_de_passe, numero_de_telephone, adresse } = userData;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error('Email already in use');

  const user = new User({
    nom,
    prenom,
    email,
    mot_de_passe,
    numero_de_telephone,
    adresse,
  });

  await user.save();

  // Send a welcome email
  await sendEmail(email, 'Welcome to Our Service', 'You have successfully signed up.');

  const token = generateToken(user);

  return { user, token };
};

const login = async ({ email, mot_de_passe }) => {
  const user = await User.findOne({ email });
  console.log(user)
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = generateToken(user);
  return token;
};

const logout = () => {
  return { message: 'Logged out successfully' };
};

module.exports = { signup, login, logout };
