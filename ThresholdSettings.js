import React, { useState } from 'react';
import { updateThresholds } from '../api';

const ThresholdSettings = () => {
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [light, setLight] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const thresholds = { temperature, humidity, light };

    try {
      await updateThresholds(thresholds);
      alert('Seuils mis à jour avec succès');
    } catch (error) {
      alert('Erreur lors de la mise à jour des seuils');
    }
  };

  return (
    <div>
      <h2>Mettre à jour les seuils des capteurs</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Température (°C): </label>
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
          />
        </div>
        <div>
          <label>Humidité (%): </label>
          <input
            type="number"
            value={humidity}
            onChange={(e) => setHumidity(e.target.value)}
          />
        </div>
        <div>
          <label>Lumière (Lux): </label>
          <input
            type="number"
            value={light}
            onChange={(e) => setLight(e.target.value)}
          />
        </div>
        <button type="submit">Mettre à jour les seuils</button>
      </form>
    </div>
  );
};

export default ThresholdSettings;
