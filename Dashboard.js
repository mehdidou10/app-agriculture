import React, { useState, useEffect } from 'react';
import { updateThresholds, getThresholds } from '../api'; // Assurez-vous d'avoir ces fonctions dans un fichier api.js

const Dashboard = () => {
  const [data, setData] = useState({
    temperature: '--',
    humidity: '--',
    light: '--',
    lastUpdate: '--',
  });

  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [light, setLight] = useState('');
  const [currentThresholds, setCurrentThresholds] = useState([]);

  // Récupérer les seuils initiaux
  useEffect(() => {
    const fetchThresholds = async () => {
      const thresholds = await getThresholds();
      if (thresholds) {
        setCurrentThresholds(thresholds);
      }
    };

    fetchThresholds();

    // WebSocket pour recevoir les données en temps réel
    const ws = new WebSocket('ws://localhost:5000');  // Assurez-vous que le WebSocket backend est bien configuré à cette URL
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setData({
        temperature: data.temperature || '--',
        humidity: data.humidity || '--',
        light: data.light || '--',
        lastUpdate: data.lastUpdate ? new Date(data.lastUpdate).toLocaleString() : '--',
      });  // Mettre à jour les données des capteurs
    };

    return () => {
      ws.close();  // Fermer la connexion WebSocket lors de la destruction du composant
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateThresholds(Number(temperature), Number(humidity), Number(light));
    setTemperature('');
    setHumidity('');
    setLight('');
  };

  return (
    <div className="container">
      <header>
        <h1>Tableau de Bord - Surveillance des Cultures</h1>
      </header>
      <main>
        <section className="sensor-data">
          <div className="data-card">
            <h3>Température</h3>
            <p>{data.temperature === '--' ? '--' : `${data.temperature} °C`}</p>
          </div>
          <div className="data-card">
            <h3>Humidité</h3>
            <p>{data.humidity === '--' ? '--' : `${data.humidity} %`}</p>
          </div>
          <div className="data-card">
            <h3>Luminosité</h3>
            <p>{data.light === '--' ? '--' : `${data.light} lux`}</p>
          </div>
          <div className="data-card">
            <h3>Dernière Mise à Jour</h3>
            <p>{data.lastUpdate === '--' ? '--' : data.lastUpdate}</p>
          </div>
        </section>

        <section className="manual-control">
          <h2>Contrôle Manuel</h2>
          <button>Arroser Manuellement</button>
          <button>Ajouter Engrais Manuellement</button>
        </section>

        <section className="threshold-settings">
          <h2>Configuration des Seuils</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Température (°C):
              <input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
              />
            </label>
            <br />
            <label>
              Humidité (%):
              <input
                type="number"
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
              />
            </label>
            <br />
            <label>
              Lumière (Lux):
              <input
                type="number"
                value={light}
                onChange={(e) => setLight(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">Mettre à jour les seuils</button>
          </form>
        </section>

        <section className="current-thresholds">
          <h2>Seuils actuels</h2>
          <ul>
            {currentThresholds.length > 0 ? (
              currentThresholds.map((threshold, index) => (
                <li key={index}>
                  Température: {threshold.temperature} °C, Humidité: {threshold.humidity} %, Lumière: {threshold.light} Lux
                </li>
              ))
            ) : (
              <p>Aucun seuil défini.</p>
            )}
          </ul>
        </section>
      </main>

      <footer>
        <p>© 2024 Smart Agriculture. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
