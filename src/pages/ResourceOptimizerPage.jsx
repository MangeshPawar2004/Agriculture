import React, { useState } from "react";

// Helper function to parse AI response into points (lines)
const parseSuggestions = (text) => {
  if (!text) return [];
  return text
    .split("\n") // Split by newline
    .map((line) => line.trim()) // Trim whitespace
    .filter((line) => line.length > 0); // Remove empty lines
};

const SmartResourceOptimization = () => {
  const [crop, setCrop] = useState("");
  const [city, setCity] = useState("");
  const [resources, setResources] = useState([]);
  // Store parsed suggestions as an array
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weatherInfo, setWeatherInfo] = useState(null); // Store fetched weather for display

  // Use Environment Variables for BOTH keys
  const VITE_OPENWEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const VITE_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const resourceOptions = [
    "Water",
    "Labor",
    "Fertilizer",
    "Tools",
    "Tractor",
    "Pesticides",
  ];

  const handleResourceToggle = (res) => {
    setResources((prev) =>
      prev.includes(res) ? prev.filter((r) => r !== res) : [...prev, res]
    );
  };

  // Fetch weather data
  const fetchWeather = async () => {
    if (!VITE_OPENWEATHER_API_KEY) {
      throw new Error("OpenWeather API Key is missing.");
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${VITE_OPENWEATHER_API_KEY}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404)
        throw new Error(`City "${city}" not found. Please check spelling.`);
      if (res.status === 401) throw new Error("Invalid OpenWeather API Key.");
      throw new Error(`Weather API request failed: ${res.statusText}`);
    }
    const json = await res.json();
    const weatherData = {
      temp: json.main.temp,
      humidity: json.main.humidity,
      weather: json.weather[0].description,
      name: json.name, // Store actual city name returned
      country: json.sys.country, // Store country
    };
    setWeatherInfo(weatherData); // Store for display
    return weatherData;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!VITE_GEMINI_API_KEY) {
      setError("Gemini API Key is missing.");
      return;
    }

    setLoading(true);
    setSuggestions([]);
    setError("");
    setWeatherInfo(null); // Clear previous weather info

    try {
      const weather = await fetchWeather(); // Fetch weather first

      // --- Refined Prompt ---
      const prompt = `Act as an agricultural optimization expert.
A farmer is growing "${crop}" in ${weather.name}, ${weather.country}.
Current weather: ${weather.temp}°C, ${weather.humidity}% humidity, Condition: ${
        weather.weather
      }.
Available resources: ${
        resources.length > 0
          ? resources.join(", ")
          : "Limited resources specified (assume basic availability)"
      }.

Provide practical, actionable suggestions for optimizing the listed available resources (or general resources if none listed). Include potential alternatives for limited resources and tips to improve yield considering the current weather.

**Output Format Rules:**
- Structure the response as a list of concise points.
- Each suggestion point MUST be on a new line.
- **DO NOT use any markdown formatting (like '*', '-', '_', '**', '#', etc.).** Just provide the plain text for each suggestion.
- Focus on being practical and farmer-friendly.
- give max 8 points.

Example point:
Adjust irrigation schedule based on the current ${
        weather.weather
      } conditions and ${weather.humidity}% humidity to conserve water.

Begin the suggestions directly.`;
      // --- End of Prompt ---

      console.log("Sending prompt to Gemini:", prompt); // For debugging

      const response = await fetch(
        // Use a capable model like 1.5 Flash or Pro
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            // Optional Safety Settings if needed
          }),
        }
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          /* ignore json parse error */
        }
        const errorMsg =
          errorData?.error?.message ||
          `Gemini request failed: ${response.statusText}`;
        console.error("Gemini API Error:", errorData);
        const blockReason = errorData?.promptFeedback?.blockReason;
        if (blockReason) {
          throw new Error(
            `Gemini request blocked: ${blockReason}. ${errorMsg}`
          );
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log("Gemini Response:", data); // For debugging

      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      const finishReason = data?.candidates?.[0]?.finishReason;

      if (reply) {
        const parsed = parseSuggestions(reply);
        setSuggestions(parsed);
        if (parsed.length === 0) {
          // AI gave a response, but parsing resulted in nothing (maybe just whitespace?)
          setError(
            "Received suggestions, but couldn't format them. Check AI response structure."
          );
          console.warn("Parsing resulted in empty array. Raw reply:", reply);
        }
      } else if (finishReason && finishReason !== "STOP") {
        setError(
          `AI generation stopped: ${finishReason}. The prompt might be too sensitive or blocked.`
        );
      } else {
        setError("No suggestions were generated by the AI.");
      }
    } catch (err) {
      console.error("Error during generation:", err);
      setError(`An error occurred: ${err.message}`);
      setSuggestions([]); // Clear suggestions on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-100 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-green-800">
          💡 Smart Resource Optimization
        </h1>
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="cropName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Crop Name
              </label>
              <input
                id="cropName"
                type="text"
                placeholder="e.g., Corn"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="cityName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City
              </label>
              <input
                id="cityName"
                type="text"
                placeholder="e.g., Paris"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Resource Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Available Resources (Optional):
            </label>
            <div className="flex flex-wrap gap-3">
              {resourceOptions.map((res) => (
                <label
                  key={res}
                  className={`cursor-pointer px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                    resources.includes(res)
                      ? "bg-green-600  border-green-700 shadow-md"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={res}
                    className="hidden"
                    checked={resources.includes(res)} // Ensure checked state matches
                    onChange={() => handleResourceToggle(res)}
                  />
                  {res}
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Selecting resources helps tailor suggestions. If none are
              selected, general advice will be given.
            </p>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-2">
            <button
              type="submit"
              className={`block mx-auto border-gray-700 py-3 px-6 rounded-xl font-semibold text-lg hover:bg-green-700 transition border-2 ${
                loading ? "animate-pulse" : ""
              }`}
              disabled={loading || !crop || !city}
              aria-live="polite"
            >
              {loading ? "Generating Suggestions..." : "Optimize Resources"}
            </button>
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <div
            role="alert"
            className="mt-6 text-center text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 font-medium"
          >
            {error}
          </div>
        )}

        {/* Weather Info Display */}
        {!loading && weatherInfo && (
          <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200 text-sm text-blue-800">
            <h3 className="font-semibold mb-1 text-base">
              Weather Info Used ({weatherInfo.name}, {weatherInfo.country}):
            </h3>
            <p>
              Temp: {weatherInfo.temp}°C | Humidity: {weatherInfo.humidity}% |
              Condition: {weatherInfo.weather}
            </p>
          </div>
        )}

        {/* Suggestions Display */}
        {!loading && suggestions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-green-700 border-b pb-2">
              ✅ Optimization Suggestions:
            </h2>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                // Render each suggestion as a "badge" or "card"
                <div
                  key={index}
                  className="flex items-start p-3 bg-lime-50 border border-lime-200 rounded-lg shadow-sm transition-all hover:shadow-md"
                >
                  <span className="flex-shrink-0 w-5 h-5 mr-3 mt-0.5">
                    {" "}
                    {/* Icon container */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <p className="text-gray-800 text-sm sm:text-base">
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Initial State Message */}
        {!loading && !error && suggestions.length === 0 && !weatherInfo && (
          <p className="text-center text-gray-500 mt-10">
            Enter crop and city, select available resources (optional), and
            click "Optimize Resources" to get suggestions.
          </p>
        )}
      </div>
    </div>
  );
};

export default SmartResourceOptimization;
