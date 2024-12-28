import React, { useState, useEffect } from 'react';
import { getThresholds } from './api';

const App = () => {
  const [data, setData] = useState({
    temperature: '--' ,
    humidity: '--',
    light: '--',
    lastUpdate: '--',
  });

  const [thresholds, setThresholds] = useState({
    temperature: '',
    humidity: '',
    light: '',
  });

  const [ws, setWs] = useState(null);

  // Fonction pour initialiser la connexion WebSocket
  const initializeWebSocket = () => {
    const socket = new WebSocket('ws://localhost:5000');

    socket.onopen = () => {
      console.log('WebSocket connecté');
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        // Mise à jour des données reçues via WebSocket
        if (message.topic === 'smart-agriculture/data' && message.message) {
          const sensorData = message.message;

          // Assurez-vous que les valeurs sont des nombres, sinon, remplacez-les par '--'
          const updatedData = {
            temperature: sensorData.temperature || '--' ,
            humidity: sensorData.humidity || '--',
            light: sensorData.light || '--',
            lastUpdate: new Date().toLocaleString(), // Utilisez la date actuelle pour la mise à jour
          };

          setData(updatedData);
        }
      } catch (error) {
        console.error('Erreur de parsing du message WebSocket:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket déconnecté. Tentative de reconnexion...');
      setTimeout(() => initializeWebSocket(), 5000); // Reconnexion automatique après 5 secondes
    };

    setWs(socket);
  };

  useEffect(() => {
    initializeWebSocket();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []); // Dépendance vide pour ne lancer qu'une seule fois au montage

  // Fonction pour récupérer les seuils depuis l'API
  useEffect(() => {
    const fetchThresholds = async () => {
      try {
        const thresholdsData = await getThresholds();
        setThresholds({
          temperature: thresholdsData.temperature || '',
          humidity: thresholdsData.humidity || '',
          light: thresholdsData.light || '',
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des seuils :', error);
      }
    };

    fetchThresholds();
  }, []);

  // Gestion des changements dans les seuils
  const handleThresholdsChange = (e) => {
    const { name, value } = e.target;
    setThresholds((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Envoi des seuils au backend via WebSocket
  const sendThresholdsToBackend = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          topic: 'smart-agriculture/data',
          message: thresholds,
        })
      );
      console.log('Seuils envoyés au backend:', thresholds);

      // Mise à jour des données avec les nouveaux seuils
      const updatedData = {
        temperature: thresholds.temperature || '--',
        humidity: thresholds.humidity || '--',
        light: thresholds.light || '--',
        lastUpdate: new Date().toLocaleString(),
      };

      setData(updatedData);
    } else {
      console.error('WebSocket non connecté ou fermé');
    }
  };

  return (
    <div>
      <h1>Smart Agriculture Monitoring</h1>

      <section>
        <h2 className="data">Current data</h2>
        <div className="donnees-container">
          <div className="donnees-item">
            Temperature: <span>{data.temperature}°C</span>
          </div>
          <div className="donnees-item">
            Humidity: <span>{data.humidity}%</span>
          </div>
          <div className="donnees-item">
            Brightness: <span>{data.light} lux</span>
          </div>
          <div className="donnees-item">
            Last update: <span>{data.lastUpdate}</span>
          </div>
        </div>
      </section>

      <section className="seuils">
        <h2>Thresholds</h2>
        <form action="#">
          <label htmlFor="temperature">Temperature :</label>
          <input
            type="text"
            id="temperature"
            name="temperature"
            value={thresholds.temperature}
            onChange={handleThresholdsChange}
            placeholder="Enter a value"
          />

          <label htmlFor="humidite">Humidity :</label>
          <input
            type="text"
            id="humidite"
            name="humidity"
            value={thresholds.humidity}
            onChange={handleThresholdsChange}
            placeholder="Enter a value"
          />

          <label htmlFor="luminosite">Brightness :</label>
          <input
            type="text"
            id="luminosite"
            name="light"
            value={thresholds.light}
            onChange={handleThresholdsChange}
            placeholder="Enter a value"
          />

          <button type="button" onClick={sendThresholdsToBackend}>Update thresholds</button>
        </form>
      </section>
    </div>
  );
};

export default App;
