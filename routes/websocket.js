let clients = [];  // stocke toutes les connexions WebSocket actives

const addClient = (ws) => {
  clients.push(ws);
};
//ws =>  connexion WebSocket
const removeClient = (ws) => {
  clients = clients.filter(client => client !== ws);
};
//filter pour conserver uniquement les connexions différentes de celle donnée.

const getClients = () => {
  return clients;
};
//Renvoie la liste des connexions WebSocket active

//envoie les data aux clients connectee  
const sendDataToClients = (data) => {
  clients.forEach(client => {
    client.send(JSON.stringify(data));
  });
};
//en json pour  échanger les données entre le  serveur et le client

// Envoyer les données des capteurs aux clients connectés
const sendSensorDataToClients = (sensorData) => {
  sendDataToClients({
    action: 'updateSensorData',
    message: sensorData
  });
};

// Envoyer les seuils aux clients
//thresholds paramt (seuil )a envoyer 
const sendThresholdsToClients = (thresholds) => {
  sendDataToClients({
    action: 'updateThresholds',//pour que le client puisse distinguer le type de données reçues.

    message: thresholds
  });
};

// Fonction pour envoyer les données mises à jour aux clients WebSocket
const sendUpdatedDataToClients = (temperature, humidity, light) => {
  const message = JSON.stringify({
    topic: 'smart-agriculture/data',
    message: {
      temperature,
      humidity,
      light,
      lastUpdate: new Date().toISOString(), //derniere mise a jour avec l'heure 
    },
  });

  clients.forEach((client) => {
    client.send(message);
  });
};
//diffuse ces donnes a tous les clients connectes 

module.exports = {
  addClient,
  removeClient,
  getClients,
  sendDataToClients,
  sendSensorDataToClients,  // Ajout de la fonction pour envoyer les données des capteurs
  sendThresholdsToClients,  // Ajout de la fonction pour envoyer les seuils
  sendUpdatedDataToClients, // Ajout de la fonction pour envoyer les données mises à jour
};
