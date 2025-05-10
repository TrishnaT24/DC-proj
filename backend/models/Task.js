const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  assignedTo: { type: String, required: true }, // Username of member
  createdBy: { type: String, required: true },  // ✅ Add this field to match controller
  status: { 
    type: String, 
    enum: ['Not Started', 'In Progress', 'Completed', 'Blocked'], 
    default: 'Not Started' 
  },
  deadline: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
