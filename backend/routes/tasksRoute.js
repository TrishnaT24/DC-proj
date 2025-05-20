const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const userController = require('../controllers/userController');

// Task routes
router.get('/tasks', taskController.getTasks);


// User routes
router.post('/users', userController.registerUser);

router.post('/users/login', userController.loginUser);

router.get('/users',userController.getAllUsers);

module.exports = router;
