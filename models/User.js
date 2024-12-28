const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Veuillez entrer un email valide.'], // Validation d'email
  },
  motDePasse: {
    type: String,
    required: true,
  },
  administrateur: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Ajoute createdAt et updatedAt automatiquement
});

const User = mongoose.model('User', userSchema);

module.exports = User;
