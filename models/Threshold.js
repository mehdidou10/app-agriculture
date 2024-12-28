const mongoose = require('mongoose');

// Schéma Threshold pour stocker les seuils
const thresholdSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  light: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true, // Ajoute les champs createdAt et updatedAt
});

/**
 * Méthode statique pour récupérer tous les seuils enregistrés.
 * @returns {Promise<Array>} - Liste des seuils.
 */
thresholdSchema.statics.getAll = async function () {
  return await this.find();
};

/**
 * Méthode d'instance pour vérifier si un seuil respecte les limites acceptables.
 * @returns {Boolean} - True si toutes les valeurs sont positives.
 */
thresholdSchema.methods.isValid = function () {
  return this.temperature > 0 && this.humidity > 0 && this.light > 0;
};

/**
 * Middleware 'pre' avant l'enregistrement : log des données.
 */
thresholdSchema.pre('save', function (next) {
  console.log('Données sauvegardées :', this);
  next();
});

const Threshold = mongoose.model('Threshold', thresholdSchema);

module.exports = Threshold;
