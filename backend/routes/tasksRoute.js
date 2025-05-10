const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const userController = require('../controllers/userController');

// Task routes
router.post('/tasks', taskController.createTask);
router.put('/tasks/status', taskController.updateTaskStatus);
router.get('/tasks', taskController.getTasks);

// User routes
router.post('/users', userController.registerUser);

router.post('/users/login', userController.loginUser);

module.exports = router;
