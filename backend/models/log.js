const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  action: String,
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'task' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('log', logSchema);
