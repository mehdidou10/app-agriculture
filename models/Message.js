// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  message: { type: Object, required: true },
  receivedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
