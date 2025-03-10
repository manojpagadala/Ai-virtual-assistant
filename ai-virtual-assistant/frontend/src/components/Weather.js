import React, { useState } from 'react';
import axios from 'axios';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/weather?city=${city}`);
      setWeather(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch weather data');
      console.error(error);
    }
  };

  return (
    <div className="weather-container">
      <h1>Weather Updates</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
        className="weather-input"
      />
      <button onClick={fetchWeather} className="weather-button">
        Get Weather
      </button>
      {weather && (
        <div className="weather-data">
          <h2>{weather.city}</h2>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Description: {weather.description}</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Weather;