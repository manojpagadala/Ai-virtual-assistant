require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const connectDB = require('./config/db'); // Fixed import
const Task = require('./models/Task'); // Fixed import

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB(); // Connect to MongoDB

app.get('/', (req, res) => res.send('Backend is running successfully!'));

// Add a new task
// app.post('/api/tasks', async (req, res) => {
//   try {
//     const { description } = req.body;
//     if (!description || typeof description !== 'string' || description.trim() === '') {
//       return res.status(400).json({ error: 'Task description must be a non-empty string' });
//     }
//     const existingTask = await Task.findOne({ description });
//     if (existingTask) return res.status(400).json({ error: 'Task already exists' });

//     const task = new Task({ description });
//     await task.save();
//     res.json({ tasks: await Task.find() });
//   } catch (error) {
//     console.error('Error adding task:', error);
//     res.status(500).json({ error: 'Failed to add task' });
//   }
// });


app.post('/api/tasks', async (req, res) => {
  try {
    console.log("Received request body:", req.body); // Debugging

    const { description } = req.body;
    if (!description || typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({ error: 'Task description must be a non-empty string' });
    }

    const existingTask = await Task.findOne({ description });
    if (existingTask) {
      console.log("Duplicate task found:", existingTask); // Debugging
      return res.status(400).json({ error: 'Task already exists' });
    }

    const task = new Task({ description });
    await task.save();

    const tasks = await Task.find();
    res.status(201).json({ tasks });

  } catch (error) {
    console.error("Error adding task:", error.message);
    res.status(500).json({ error: error.message });
  }
});


// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    res.json({ tasks: await Task.find() });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Mark a task as completed
app.put('/api/tasks/:id/complete', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.completed = true;
    await task.save();
    res.json({ tasks: await Task.find() });
  } catch (error) {
    console.error('Error marking task as completed:', error);
    res.status(500).json({ error: 'Failed to mark task as completed' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json({ tasks: await Task.find() });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// AI Assistant Route
app.post('/api/assistant', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Call the Gemini API
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent',
      {
        contents: [{ role: 'user', parts: [{ text: message }] }],
      },
      {
        params: { key: process.env.GEMINI_API_KEY },
      }
    );

    res.json({ reply: response.data.candidates[0].content.parts[0].text });
  } catch (error) {
    console.error('Error processing assistant request:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Weather API Route
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`
    );
    res.json({
      city: response.data.name,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// News API Route
app.get('/api/news', async (req, res) => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWSAPI_API_KEY}`
    );
    res.json(
      response.data.articles.map((article) => ({
        title: article.title,
        description: article.description,
        url: article.url,
      }))
    );
  } catch (error) {
    console.error('Error fetching news data:', error);
    res.status(500).json({ error: 'Failed to fetch news data' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
