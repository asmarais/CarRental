const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Role = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

// User Schema
const userSchema = new mongoose.Schema({
  user_id: { type: Number, unique: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mot_de_passe: { type: String, required: true },
  numero_de_telephone: { type: String, required: true },
  adresse: { type: String, required: true },
  date_de_creation: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.USER,
  },
  statut_verification: { type: Boolean, default: false },
});

// Auto-increment for user_id
userSchema.plugin(AutoIncrement, { inc_field: 'user_id' });

// Hash password before saving the document
userSchema.pre('save', async function (next) {
  if (!this.isModified('mot_de_passe')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.mot_de_passe);
};

const User = mongoose.model('User', userSchema);

module.exports = { User, Role };
