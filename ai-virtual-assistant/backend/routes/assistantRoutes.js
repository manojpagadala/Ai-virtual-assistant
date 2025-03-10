// const express = require('express');
// const { sendMessage } = require('../controllers/assistantController');

// const router = express.Router();

// router.post('/', sendMessage);

const express = require('express');
const router = express.Router();
const { addTask, getTasks, deleteTask } = require('../controllers/assistantController');
const auth = require('../middleware/auth'); // Authentication middleware

// Task Management Routes
router.post('/tasks', auth, addTask); // Add a new task
router.get('/tasks', auth, getTasks); // Get all tasks for the logged-in user
router.delete('/tasks/:id', auth, deleteTask); // Delete a task

module.exports = router;