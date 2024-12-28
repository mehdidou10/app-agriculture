const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const mqttClient = require('./routes/mqtt'); // Importation de mqttClient
const { latestSensorData } = require('./routes/mqtt'); // Importation des dernières données MQTT
const thresholdsRouter = require('./routes/thresholds');
const config = require('./config');
const websocket = require('./routes/websocket'); // Importation du module WebSocket
const subscribersRouter = require('./routes/subscribers');
const authRoutes = require('./routes/auth'); // Importation des routes auth

// Modèle pour les seuils
const Threshold = require('./models/Threshold');

// Schéma et modèle Threshold
const thresholdSchema = new mongoose.Schema({
  temperature: { type: Number, required: true, min: -50, max: 100 },
  humidity: { type: Number, required: true, min: 0, max: 100 },
  light: { type: Number, required: true, min: 0, max: 1000 },
  lastUpdate: { type: Date, default: Date.now },
});
module.exports = mongoose.models.Threshold || mongoose.model('Threshold', thresholdSchema);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////MEHDI
// Création de l'application Express
const app = express();

// Middleware pour les routes des abonnés
app.use('/api/subscribers', subscribersRouter);

// Configuration des options CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

// Middleware pour parser les données JSON
app.use(express.json());
app.use(bodyParser.json());
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////MEHDI

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////RAYAN
// Vérification de la connexion à MongoDB
mongoose.connection.on('connected', () => {
  console.log('✅Connexion MongoDB établie.');
});
mongoose.connection.on('error', (err) => {
  console.error('Erreur MongoDB:', err);
});

// Connexion à MongoDB
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅Connecté à MongoDB');
  })
  .catch((err) => {
    console.error('Erreur MongoDB:', err);
  });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////RAYAN



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Mehdi
// Création du serveur HTTP et WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Gestion des connexions WebSocket
wss.on('connection', (ws) => {
  console.log('✅Client connecté au WebSocket');

  websocket.addClient(ws);

  ws.on('message', (message) => {
    try {
      const messageData = JSON.parse(message);
      console.log('📩Message reçu:', messageData);

      if (messageData.topic === 'smart-agriculture/data') {
        const { temperature, humidity, light } = messageData.message;
        const lastUpdate = new Date().toISOString();

        const temp = parseFloat(temperature);
        const hum = parseFloat(humidity);
        const li = parseFloat(light);

        if (isNaN(temp) || isNaN(hum) || isNaN(li)) {
          console.error('❌Données invalides reçues:', messageData);
          ws.send(JSON.stringify({ error: 'Données non valides' }));
          return;
        }

        updateThresholdsInMongoDB(temp, hum, li, lastUpdate);
        sendUpdatedDataToClients(temp, hum, li, lastUpdate);
      } else {
        console.error('⚠️Topic non reconnu:', messageData.topic);
        ws.send(JSON.stringify({ error: 'Topic non reconnu' }));
      }
    } catch (error) {
      console.error('⚠️Erreur de traitement du message WebSocket:', error);
      ws.send(JSON.stringify({ error: 'Message invalide' }));
    }
  });

  ws.on('close', () => {
    console.log('🔌Client déconnecté du WebSocket');
    websocket.removeClient(ws);
  });

  ws.on('error', (error) => {
    console.error('⚠️Erreur WebSocket:', error);
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////MEHDI


/////////////////////////////////////////////////////////////////////////RAYAN
// Routes API
app.use('/api/thresholds', thresholdsRouter);
app.use('/api/auth', authRoutes);

// Route pour récupérer les données des capteurs via MQTT
app.get('/api/sensor-data', (req, res) => {
  try {
    if (latestSensorData && latestSensorData.temperature !== null) {
      res.json(latestSensorData);
    } else {
      res.status(404).json({ message: 'Aucune donnée capteur disponible actuellement.' });
    }
  } catch (error) {
    console.error('⚠️Erreur lors de la récupération des données capteurs:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Route pour ajouter un nouveau seuil (pour tester l’API)
app.post('/api/thresholds', async (req, res) => {
  const { temperature, humidity, light } = req.body;

  if (
    temperature < -50 || temperature > 100 ||
    humidity < 0 || humidity > 100 ||
    light < 0 || light > 1000
  ) {
    return res.status(400).json({ error: 'Données invalides' });
  }

  try {
    const newThreshold = new Threshold({ temperature, humidity, light });
    await newThreshold.save();
    res.status(201).json(newThreshold);
  } catch (error) {
    console.error('⚠️Erreur lors de l’ajout des seuils:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Middleware pour gérer les erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route introuvable' });
});

// Middleware global pour gérer les erreurs de serveur
app.use((err, req, res, next) => {
  console.error('⚠️Erreur serveur:', err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Servir les fichiers React si en production
const clientBuildPath = path.join(__dirname, '../client/build');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////RAYAN

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////MEHDI
// Démarrer le serveur HTTP
const PORT = config.port || 5000;
server.listen(PORT, () => {
  console.log(`🚀Serveur démarré sur le port ${PORT}`);
});

// Fonction pour mettre à jour les seuils dans MongoDB
async function updateThresholdsInMongoDB(temperature, humidity, light, lastUpdate) {
  try {
    const updatedThreshold = await Threshold.findOneAndUpdate(
      {},
      { temperature, humidity, light, lastUpdate },
      { new: true, upsert: true }
    );
    console.log('✅Seuils mis à jour dans MongoDB:', updatedThreshold);
  } catch (error) {
    console.error('❌Erreur lors de la mise à jour des seuils dans MongoDB:', error);
  }
}

// Fonction pour envoyer les données mises à jour aux clients WebSocket
function sendUpdatedDataToClients(temperature, humidity, light, lastUpdate) {
  const data = JSON.stringify({
    temperature,
    humidity,
    light,
    lastUpdate,
  });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
  console.log('📤Données envoyées aux clients WebSocket:', data);
}

// Exporter wss pour l'utiliser dans d'autres fichiers
module.exports = wss;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////MEHDI

