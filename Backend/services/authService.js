const bcrypt = require('bcryptjs');
const { User } = require('../models/userModel');
const { generateToken } = require('../utils/tokenService');
const { sendEmail } = require('../utils/emailService');

const signup = async (userData) => {
  const { nom, prenom, email, mot_de_passe, numero_de_telephone, adresse, cin } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error('Email already in use');

  const user = new User({
    nom,
    prenom,
    email,
    mot_de_passe,
    numero_de_telephone,
    adresse,
    cin, 
  });

  await user.save();
  await sendEmail(email, 'Welcome to CarRental', prenom, mot_de_passe);
  
  return { user };
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
