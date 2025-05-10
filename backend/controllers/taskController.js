const Task = require('../models/Task');
const User = require('../models/User');

// Create a task (Leader only)
// Create a task (Leader only)
exports.createTask = async (req, res) => {
  try {
    const { title,assignedTo, deadline, username: createdBy } = req.body;

    const user = await User.findOne({ username: createdBy });
    if (!user || user.role !== 'leader') {
      return res.status(403).json({ error: 'Only leaders can create tasks' });
    }

    const member = await User.findOne({ username: assignedTo });
    if (!member || member.role !== 'member') {
      return res.status(400).json({ error: 'Invalid member username' });
    }

    const task = new Task({
      title,
      assignedTo,
      createdBy,
      deadline,
      status: 'Not Started'
    });

    await task.save();
    res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


// Update task status (Members only)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { title, status, username } = req.body;

    const user = await User.findOne({ username });
    if (!user || user.role !== 'member') {
      return res.status(403).json({ error: 'Only members can update task status' });
    }

    const task = await Task.findOne({ title, assignedTo: username });
    if (!task) {
      return res.status(403).json({ error: 'Task not found or not assigned to you' });
    }

    task.status = status;
    await task.save();

    res.status(200).json({ message: 'Task status updated', task });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


// Fetch tasks (For leader: all tasks, for member: their tasks)
// exports.getTasks = async (req, res) => {
//   try {
//     const username = req.query.username; // Sent from frontend

//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).json({ error: 'User not found' });
//     }

//     let tasks;
//     if (user.role === 'leader') {
//       // Leader sees all tasks they created
//       tasks = await Task.find({ createdBy: username });
//     } else {
//       // Member sees only their assigned tasks
//       tasks = await Task.find({ assignedTo: username });
//     }

//     res.status(200).json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find(); // ⬅️ Fetch all tasks, no filtering

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
