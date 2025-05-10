const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/tasks', taskController.createTask);
router.put('/tasks/status', taskController.updateTaskStatus);
router.get('/tasks', taskController.getTasks);

module.exports = router;