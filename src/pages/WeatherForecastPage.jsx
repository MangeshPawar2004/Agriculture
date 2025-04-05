import React, { useState } from "react";

const WeatherCropAlert = () => {
  const [city, setCity] = useState("");
  const [crop, setCrop] = useState("");
  const [error, setError] = useState(false);
  const [alert, setAlert] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = "a9f8e7e20c9e6aaf79970887355da345";
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const fetchWeatherInfo = async () => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!res.ok) throw new Error("City not found");
    const json = await res.json();
    return {
      city,
      temp: json.main.temp,
      tempMin: json.main.temp_min,
      tempMax: json.main.temp_max,
      humidity: json.main.humidity,
      feelsLike: json.main.feels_like,
      weather: json.weather[0].description,
    };
  };

  const cleanMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/#+ /g, "")
      .replace(/^- /gm, "•")
      .replace(/\n{2,}/g, "\n");
  };

  const formatTo7Day = (text) => {
    const days = text.split(/(?=Day \d:)/i);
    return days
      .map((day) => day.trim())
      .filter(Boolean)
      .join("\n\n");
  };

  const generateCropAlert = async (weatherData) => {
    const prompt = `You are an agricultural assistant. A farmer is growing ${crop} in ${city}. 
Here is the current weather:
Temperature: ${weatherData.temp}°C
Feels Like: ${weatherData.feelsLike}°C
Humidity: ${weatherData.humidity}%
Weather Description: ${weatherData.weather}

Generate a 7-day forecast prediction with short, actionable crop-specific suggestions (in plain text format). Avoid any markdown formatting. Use this format:
Day 1: ...
Day 2: ...
...
Day 7: ...`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();
    let response =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No alert generated.";

    response = cleanMarkdown(response);
    response = formatTo7Day(response);
    setAlert(response);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setAlert("");
    setWeather(null);
    setLoading(true);
    try {
      const weatherInfo = await fetchWeatherInfo();
      setWeather(weatherInfo);
      await generateCropAlert(weatherInfo);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 text-black">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Weather & Crop Alert</h1>
          <p className="text-lg text-gray-800">
            Get real-time weather updates and crop-specific alerts
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.01] transition-transform duration-300">
          <form onSubmit={handleSubmit} className="space-y-8 text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-semibold mb-2">
                  Crop Name
                </label>
                <input
                  type="text"
                  required
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                  placeholder="Enter crop name"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold mb-2">
                  City Name
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                  placeholder="Enter city name"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 transform hover:scale-105 transition-all duration-300 shadow-lg ${
                  loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  "Get Crop Alert"
                )}
              </button>
            </div>

            {error && (
              <div className="text-center">
                <p className="text-red-600 font-bold text-lg">
                  ⚠️ Could not fetch weather. Try again!
                </p>
              </div>
            )}
          </form>

          {weather && (
            <div className="mt-12 bg-gray-50 p-6 rounded-xl">
              <h4 className="text-2xl font-bold mb-4">
                🌦️ Current Weather in {weather.city}
              </h4>
              <ul className="space-y-3 text-lg">
                <li className="font-semibold">Temperature: {weather.temp}°C</li>
                <li className="font-semibold">
                  Feels Like: {weather.feelsLike}°C
                </li>
                <li className="font-semibold">Humidity: {weather.humidity}%</li>
                <li className="font-semibold">Condition: {weather.weather}</li>
              </ul>
            </div>
          )}

          {alert && (
            <div className="mt-12 bg-orange-50 p-6 rounded-xl">
              <h4 className="text-2xl font-bold mb-4">🚨 7-Day Crop Alert</h4>
              <pre className="text-lg font-medium text-black whitespace-pre-wrap">
                {alert}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherCropAlert;
