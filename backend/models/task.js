const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String},
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('task', taskSchema);
