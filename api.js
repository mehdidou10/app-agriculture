const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Récupérer les données des capteurs
export const getSensorData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/sensor-data`);
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    const data = await response.json();
    console.log('Données des capteurs:', data);  // Log pour vérifier les données récupérées
    return data;
  } catch (error) {
    console.error('Erreur dans getSensorData:', error.message);
    throw error;
  }
};

// Récupérer les seuils configurés
export const getThresholds = async () => {
  try {
    const response = await fetch(`${BASE_URL}/thresholds`);
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    const data = await response.json();
    console.log('Seuils récupérés:', data);  // Log pour vérifier les seuils récupérés
    return data;
  } catch (error) {
    console.error('Erreur dans getThresholds:', error.message);
    throw error;
  }
};

// Mettre à jour les seuils configurés
export const updateThresholds = async (thresholds) => {
  try {
    const response = await fetch(`${BASE_URL}/thresholds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(thresholds),
    });
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    const data = await response.json();
    console.log('Seuils mis à jour:', data);  // Log pour vérifier les seuils mis à jour
    return data;
  } catch (error) {
    console.error('Erreur dans updateThresholds:', error.message);
    throw error;
  }
};
