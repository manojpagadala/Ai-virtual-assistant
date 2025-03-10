AI-Powered Virtual Assistant Web App
Overview
This project is a MERN stack-based virtual assistant web application that provides voice and text-based interaction for task management, including scheduling, reminders, and real-time updates. The app integrates OpenAI API for intelligent responses and Google/IBM Watson Speech-to-Text APIs for converting voice commands into text. The frontend is built using React.js, Tailwind CSS, and Bootstrap, while the backend is powered by Node.js and MongoDB.

Features
Task Management:

Schedule tasks and set reminders.

Real-time updates and notifications.

Voice and Text Interaction:

Use voice commands or text input to interact with the virtual assistant.

Convert voice commands into text using Google/IBM Watson Speech-to-Text APIs.

AI-Powered Responses:

Generate intelligent responses using OpenAI API.

Real-Time Updates:

Fetch real-time weather and news updates.

User-Friendly Interface:

Smooth and responsive UI built with React.js, Tailwind CSS, and Bootstrap.

Technologies Used
Frontend
React.js: For building the user interface.

Tailwind CSS: For styling and responsive design.

Bootstrap: For additional UI components and layout.

Backend
Node.js: For server-side logic and API integration.

Express.js: For building RESTful APIs.

Database
MongoDB: For storing user data, tasks, and reminders.

APIs
OpenAI API: For generating intelligent responses.

Google/IBM Watson Speech-to-Text API: For converting voice commands into text.

Weather API: For fetching real-time weather updates.

News API: For fetching real-time news updates.

Project Structure
Installation
Prerequisites
Node.js and npm installed on your machine.

MongoDB database set up locally or using a cloud service like MongoDB Atlas.

API keys for OpenAI, Google/IBM Watson Speech-to-Text, Weather API, and News API.

Steps
Clone the Repository:

bash
cd ai-virtual-assistant
Install Backend Dependencies:

bash
Copy
cd backend
npm install
Install Frontend Dependencies:

bash
Copy
cd ../frontend
npm install
Set Up Environment Variables:

Create a .env file in the backend folder and add the following:

Copy
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
SPEECH_TO_TEXT_API_KEY=your_speech_to_text_api_key
WEATHER_API_KEY=your_weather_api_key
NEWS_API_KEY=your_news_api_key
JWT_SECRET=your_jwt_secret
Run the Backend:

bash
Copy
cd ../backend
npm start
Run the Frontend:

bash
Copy
cd ../frontend
npm start
Access the Application:

Open your browser and navigate to http://localhost:3000.

Usage
Task Management:

Add, edit, delete, and mark tasks as completed.

Set reminders for tasks.

Voice and Text Interaction:

Use the microphone button to input voice commands.

Type messages in the input field for text-based interaction.

Real-Time Updates:

Check the weather for any city.

Read the latest news updates.

AI-Powered Responses:

Ask the virtual assistant questions and receive intelligent responses.

API Endpoints
Task Management
GET /api/tasks: Fetch all tasks for the logged-in user.

POST /api/tasks: Add a new task.

PUT /api/tasks/:id /complete: Mark a task as completed.

DELETE /api/tasks/:id : Delete a task.

AI Interaction
POST /api/message: Send a message to the AI assistant and receive a response.

Weather
GET /api/weather?city=city_name: Fetch weather data for a specific city.

News
GET /api/news: Fetch the latest news updates.

Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.

Create a new branch (git checkout -b feature/YourFeatureName).

Commit your changes (git commit -m 'Add some feature').

Push to the branch (git push origin feature/YourFeatureName).

Open a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Acknowledgments
OpenAI for providing the AI API.

Google/IBM Watson for the Speech-to-Text API.

Tailwind CSS and Bootstrap for UI components.

MongoDB for the database.

Contact
For any questions or feedback, please contact:

Your Name:Pagadala manoj 

Email: pagadalamanoj05@gmail.com
