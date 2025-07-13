import { useState } from 'react';
import './App.css';

// Define TypeScript type for weather data
type WeatherData = {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
    main: string;
  }[];
};

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const getWeather = async () => {
    if (!city.trim()) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();

      if (data.cod === '404') {
        setError('City not found.');
        setWeather(null);
      } else {
        setError('');
        setWeather(data);
      }
    } catch {
      setError('Error fetching weather.');
      setWeather(null);
    }
  };

  return (
    <div className={`app ${weather ? weather.weather[0].main.toLowerCase() : ''}`}>
      <div className="container">
        <h1>Weather App</h1>

        <div className="search">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={getWeather}>Search</button>
        </div>

        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-info">
            <h2>{weather.name}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <p><strong>Temp:</strong> {weather.main.temp}°C</p>
            <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
            <p><strong>Condition:</strong> {weather.weather[0].description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
