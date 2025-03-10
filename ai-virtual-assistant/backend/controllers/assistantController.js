const { GoogleGenerativeAI } = require('@google/generative-ai');
const Task = require('../models/Task'); // Import the Task model

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("Google API Key:", process.env.GEMINI_API_KEY ? "Loaded" : "Not Found");

// Send Message to Gemini AI
exports.sendMessage = async (req, res) => {
  const { message } = req.body;

  console.log('Received message:', message); // Debugging

  try {
    // Initialize the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', apiVersion: 'v1' });

    // Generate a response
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini response:', text); // Debugging

    res.json({ reply: text });
  } catch (error) {
    console.error('Error in sendMessage:', error); // Debugging
    res.status(500).json({ error: 'An error occurred' });
  }
};

// Add a new task
exports.addTask = async (req, res) => {
  const { task, reminder } = req.body;
  const user = req.user.id; // Assuming you have user authentication

  try {
    const newTask = new Task({ task, reminder, user });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error in addTask:', error); // Debugging
    res.status(500).json({ error: 'An error occurred while adding the task' });
  }
};

// Get all tasks for the logged-in user
exports.getTasks = async (req, res) => {
  const user = req.user.id; // Assuming you have user authentication

  try {
    const tasks = await Task.find({ user });
    res.json(tasks);
  } catch (error) {
    console.error('Error in getTasks:', error); // Debugging
    res.status(500).json({ error: 'An error occurred while fetching tasks' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await Task.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteTask:', error); // Debugging
    res.status(500).json({ error: 'An error occurred while deleting the task' });
  }
};