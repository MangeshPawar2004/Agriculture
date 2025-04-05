import axios from 'axios';

const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherForecast = async (latitude, longitude) => {
  try {
    // For development, return mock data
    if (!OPENWEATHER_API_KEY) {
      return mockWeatherForecast();
    }

    const response = await axios.get(
      `${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    return processWeatherData(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return mockWeatherForecast();
  }
};

const processWeatherData = (data) => {
  // Process next 7 days of weather data
  const forecast = data.list.slice(0, 7).map(day => ({
    date: new Date(day.dt * 1000),
    rain: day.rain ? true : false,
    temperature: day.main.temp,
    humidity: day.main.humidity,
    description: day.weather[0].description
  }));

  return {
    forecast,
    willRainSoon: forecast.slice(0, 3).some(day => day.rain)
  };
};

const mockWeatherForecast = () => {
  const forecast = Array(7).fill(null).map((_, index) => ({
    date: new Date(Date.now() + index * 24 * 60 * 60 * 1000),
    rain: Math.random() > 0.7,
    temperature: 20 + Math.random() * 10,
    humidity: 50 + Math.random() * 30,
    description: 'Partly cloudy'
  }));

  return {
    forecast,
    willRainSoon: forecast.slice(0, 3).some(day => day.rain)
  };
};

export default {
  getWeatherForecast
}; 