// routes/api.js
const express = require('express');
const Threshold = require('../models/Threshold');
const router = express.Router();

// Récupérer les seuils
router.get('/thresholds', async (req, res) => {
  try {
    const thresholds = await Threshold.find();
    res.json(thresholds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour les seuils
router.post('/thresholds', async (req, res) => {
  const { temperature, humidity, light } = req.body;

  const threshold = new Threshold({
    temperature,
    humidity,
    light,
  });

  try {
    await threshold.save();
    res.status(201).json(threshold);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;


