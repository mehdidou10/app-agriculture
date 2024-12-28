// script.js (Frontend)
const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
  console.log('Connecté au WebSocket');
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.action === 'updateSensorData') {
    // Mise à jour des données des capteurs
    document.getElementById('temperature').textContent = `${data.message.temperature} °C`;
    document.getElementById('humidity').textContent = `${data.message.humidity} %`;
    document.getElementById('light').textContent = `${data.message.light} lux`;

    // Mise à jour de la dernière mise à jour
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
      lastUpdateElement.textContent = `Dernière mise à jour : ${data.message.lastUpdate}`;
    }
  }

  if (data.action === 'updateThresholds') {
    // Mise à jour des seuils sur la page
    document.getElementById('temp-threshold').value = data.message.temperatureThreshold;
    document.getElementById('humidity-threshold').value = data.message.humidityThreshold;
    document.getElementById('light-threshold').value = data.message.lightThreshold;
  }
};

// Gestion de la soumission du formulaire pour mettre à jour les seuils
document.getElementById('threshold-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const thresholds = {
    temperature: document.getElementById('temp-threshold').value,
    humidity: document.getElementById('humidity-threshold').value,
    light: document.getElementById('light-threshold').value,
  };

  // Envoi des nouveaux seuils au serveur via WebSocket
  socket.send(JSON.stringify({
    action: 'setThresholds',
    message: thresholds,
  }));
});
