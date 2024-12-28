const mqtt = require('mqtt');
const config = require('../config');
const client = mqtt.connect(config.mqttBroker);
const Threshold = require('../models/Threshold'); // Importation du modèle Threshold
const websocket = require('./websocket'); // Importation du module WebSocket

// Variable pour stocker les dernières données reçues
let latestSensorData = {
  temperature: null,
  humidity: null,
  light: null,
  lastUpdate: null,
};

client.on('connect', () => {
  console.log('✅Connecté au broker MQTT');
  client.subscribe('smart-agriculture/data', (err) => {
    if (err) {
      console.error("Erreur d'abonnement:", err);
    }
  });
});

client.on('message', async (topic, message) => {
  const messageContent = JSON.parse(message.toString());

  // Traduire les clés du message et ajouter l'heure de la dernière mise à jour
  const translatedContent = {
    temperature: messageContent['température'], // Traduction de 'température' en 'temperature'
    humidity: messageContent['humidité'],       // Traduction de 'humidité' en 'humidity'
    light: messageContent['lumière'],          // Traduction de 'lumière' en 'light'
    lastUpdate: new Date().toISOString(),      // Ajouter l'heure de la dernière mise à jour
  };

  // Mettre à jour la variable latestSensorData
  latestSensorData = translatedContent;

  // 1. Enregistrer les données dans MongoDB
  try {
    const newThreshold = new Threshold(translatedContent);
    await newThreshold.save(); // Sauvegarder les données dans MongoDB
    console.log('💾Message stocké dans MongoDB', newThreshold);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement dans MongoDB:", error);
  }

  // 2. Envoyer le message à tous les clients WebSocket connectés
  websocket.sendDataToClients({
    topic: topic,
    message: translatedContent,
  });

  console.log(`🤝Message reçu [${topic}]:`, translatedContent);
});

// Exporter le client MQTT et les dernières données reçues
module.exports = { client, latestSensorData };
