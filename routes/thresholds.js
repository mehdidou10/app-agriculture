const express = require('express');
const router = express.Router();
const Threshold = require('../models/Threshold');

// Route pour obtenir tous les seuils
router.get('/', async (req, res) => { // Suppression de "/thresholds" ici
  try {
    const thresholds = await Threshold.find();
    res.status(200).json(thresholds);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des seuils.' });
  }
});

// Route pour ajouter un seuil
router.post('/', async (req, res) => { // Suppression de "/thresholds" ici
  const { temperature, humidity, light } = req.body;

  try {
    const newThreshold = new Threshold({ temperature, humidity, light });
    await newThreshold.save();
    res.status(201).json(newThreshold);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de l\'enregistrement des seuils.' });
  }
});

module.exports = router;
