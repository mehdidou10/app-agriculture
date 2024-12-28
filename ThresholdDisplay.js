// src/ThresholdDisplay.js
import React, { useState, useEffect } from 'react';

const ThresholdDisplay = () => {
  const [thresholds, setThresholds] = useState([]);

  useEffect(() => {
    const fetchThresholds = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/thresholds');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des seuils');
        }
        const data = await response.json();
        setThresholds(data);
      } catch (error) {
        console.error('Erreur dans fetchThresholds:', error.message);
      }
    };

    fetchThresholds();
  }, []);

  return (
    <div>
      <h1>Seuils Actuels</h1>
      <ul>
        {thresholds.map((threshold) => (
          <li key={threshold._id}>
            Température: {threshold.temperature}°C, Humidité: {threshold.humidity}%, Lumière: {threshold.light} Lux
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThresholdDisplay;
