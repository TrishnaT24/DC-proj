const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: String, required: true }, // Username of member
  createdBy: { type: String, required: true },  // Username of leader
  status: { 
    type: String, 
    enum: ['Not Completed', 'In Progress', 'Completed'], 
    default: 'Not Completed' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);