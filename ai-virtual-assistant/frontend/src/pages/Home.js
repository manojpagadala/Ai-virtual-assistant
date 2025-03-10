import React, { useState, useEffect } from "react";
import { sendMessage } from "../services/api";
import axios from "axios";

function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);
  const [tasks, setTasks] = useState([]); // Initialize as an empty array
  const [activeTab, setActiveTab] = useState("assistant"); // Tabs: assistant, weather, news, tasks
  const [reminder, setReminder] = useState(new Date()); // Add reminder state

  // Fetch tasks on component mount
  useEffect(() => {
    if (activeTab === "tasks") {
      fetchTasks();
    }
  }, [activeTab]);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      console.log("Backend response:", response.data); // Debugging
      setTasks(response.data.tasks || response.data); // Handle both cases
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to fetch tasks. Please try again.");
    }
  };

  // Add a new task
  const addTask = async (description, reminder) => {
    try {
      const user = localStorage.getItem('userId'); // Get the user ID from local storage or context
      if (!user) {
        throw new Error("User not authenticated");
      }

      const response = await axios.post("http://localhost:5000/api/tasks", {
        task: description, // Task description
        reminder, // Reminder date/time
        user, // User ID
      });
      setTasks([...tasks, response.data]); // Add the new task to the tasks list
      setMessage(""); // Clear the input field
      setReminder(new Date()); // Reset the reminder
    } catch (error) {
      console.error("Error adding task:", error);

      // Additional logs for debugging
      if (error.response) {
        console.error("Server responded with status:", error.response.status);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        console.error("No response received. Request details:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }

      setError("Failed to add task. Please try again.");
    }
  };

  // Mark a task as completed
  const markTaskAsCompleted = async (taskId) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}/complete`);
      setTasks(tasks.map((task) =>
        task._id === taskId ? { ...task, completed: true } : task
      )); // Update the task in the state
    } catch (error) {
      console.error("Error marking task as completed:", error);
      setError("Failed to mark task as completed. Please try again.");
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId)); // Remove the task from the state
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
    }
  };

  // Handle text input submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await sendMessage(message);
      setReply(response);
    } catch (error) {
      setError("Failed to send message. Please try again.");
      console.error(error); // Debugging
    }
  };

  // Handle voice input
  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setMessage(speechResult); // Set the voice input as the message
      console.log("You said:", speechResult);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError("Failed to recognize speech. Please try again.");
    };
  };

  // Speak the AI's response
  const speakResponse = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  // Fetch weather data
  const fetchWeather = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/weather?city=${city}`);
      setWeather(response.data);
      setError("");
    } catch (error) {
      setError("Failed to fetch weather data");
      console.error(error);
    }
  };

  // Fetch news data
  const fetchNews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/news");
      setNews(response.data);
      setError("");
    } catch (error) {
      setError("Failed to fetch news data");
      console.error(error);
    }
  };

  // Load news data when the news tab is active
  useEffect(() => {
    if (activeTab === "news") {
      fetchNews();
    }
  }, [activeTab]);

  return (
    <div className="container mt-5">
      <h1>AI Virtual Assistant</h1>

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4">
        <button
          className={`btn ${activeTab === "assistant" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveTab("assistant")}
        >
          Assistant
        </button>
        <button
          className={`btn ${activeTab === "weather" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveTab("weather")}
        >
          Weather
        </button>
        <button
          className={`btn ${activeTab === "news" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveTab("news")}
        >
          News
        </button>
        <button
          className={`btn ${activeTab === "tasks" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveTab("tasks")}
        >
          Tasks
        </button>
      </div>

      {/* Assistant Tab */}
      {activeTab === "assistant" && (
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="form-control mb-3"
            />
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                Send
              </button>
              <button
                type="button"
                onClick={handleVoiceInput}
                className="btn btn-secondary"
              >
                🎤 Use Voice
              </button>
            </div>
          </form>
          {reply && (
            <div className="mt-4">
              <p className="fw-bold">AI Response:</p>
              <p>{reply}</p>
              <button
                onClick={() => speakResponse(reply)}
                className="btn btn-success"
              >
                🔊 Speak Response
              </button>
            </div>
          )}
        </>
      )}

      {/* Weather Tab */}
      {activeTab === "weather" && (
        <>
          <div className="weather-container">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="form-control mb-3"
            />
            <button onClick={fetchWeather} className="btn btn-primary">
              Get Weather
            </button>
            {weather && (
              <div className="mt-4">
                <h2>{weather.city}</h2>
                <p>Temperature: {weather.temperature}°C</p>
                <p>Description: {weather.description}</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* News Tab */}
      {activeTab === "news" && (
        <>
          <div className="news-container">
            {news.map((article, index) => (
              <div key={index} className="mb-4">
                <h2>{article.title}</h2>
                <p>{article.description}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  Read more
                </a>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Tasks Tab */}
      {activeTab === "tasks" && (
        <>
          <div className="task-management">
            <h2>Tasks</h2>
            <ul className="list-group">
              {tasks.map((task) => (
                <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                    {task.task} - {new Date(task.reminder).toLocaleString()} {/* Display task and reminder */}
                  </span>
                  <div>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => markTaskAsCompleted(task._id)}
                      disabled={task.completed}
                    >
                      ✅ Complete
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteTask(task._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Add Task Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addTask(message, reminder); // Pass both description and reminder
              setMessage(""); // Clear the input field
              setReminder(new Date()); // Reset the reminder
            }}
            className="mt-4"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a new task..."
              className="form-control mb-3"
            />
            <input
              type="datetime-local"
              value={reminder.toISOString().slice(0, 16)} // Format the date for input
              onChange={(e) => setReminder(new Date(e.target.value))} // Update the reminder
              className="form-control mb-3"
            />
            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </form>
        </>
      )}

      {/* Error Message */}
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
}

export default Home;