// config.js
module.exports = {
  mqttBroker3: {
    url: 'mqtt://192.168.1.3:1883',
    clientId: 'client_id_1'     // Remplacez par un ID client unique si nécessaire
  },
  mqttBroker2: {
    url: 'mqtt://test.mosquitto.org:1883',
    clientId: 'client_id_2'     // Remplacez par un ID client unique si nécessaire
  },
  mqttBroker: {
    url: 'mqtt://105.99.51.179:1883',
    clientId: 'client_id_3'     // Remplacez par un ID client unique si nécessaire
  },
  
  mongoURI : 'mongodb+srv://st5bourada202031083340:azerayen123456@cluster0.lx72k.mongodb.net/smart_agriculture?retryWrites=true&w=majority', // Utilisez 127.0.0.1 au lieu de localhost

};
