const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

// Route pour créer un nouvel abonné
router.post('/', async (req, res) => {
  const { name, prenom, email, password, isAdmin } = req.body;

  try {
    const newSubscriber = new Subscriber({ name, prenom, email, password, isAdmin });
    const savedSubscriber = await newSubscriber.save();
    res.status(201).json(savedSubscriber);
  } catch (error) {
    console.error('Erreur lors de la création de l\'abonné:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'abonné' });
  }
});

// Route pour récupérer tous les abonnés
router.get('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnés:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des abonnés' });
  }
});

module.exports = router;
