const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const userController = require('../controllers/userController');

router.put('/tasks/status', taskController.updateTaskStatus);

module.exports = router;