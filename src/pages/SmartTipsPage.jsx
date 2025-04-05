import React, { useState } from "react";

// Simpler parsing function based on newlines
const parseTips = (text) => {
  if (!text) return [];
  return text
    .split("\n") // Split by newline
    .map((line) => line.trim()) // Trim whitespace from each line
    .filter((line) => line.length > 0); // Remove any resulting empty lines
};

const SmartTips = () => {
  const [crop, setCrop] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [specificIssue, setSpecificIssue] = useState("");
  const [tips, setTips] = useState([]); // Stores array of tip strings
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weatherInfo, setWeatherInfo] = useState(null); // For context display

  // Correctly reference env variables (ensure VITE_WEATHER_API_KEY is set in .env)
  const VITE_WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const VITE_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const categories = [
    "Fertilizer Application", // Be more specific?
    "Pest & Disease Management",
    "Irrigation Scheduling",
    "Harvesting Timing & Techniques",
    "General Crop Health",
    "Sustainable & Organic Practices",
    "Soil Health Management",
  ];

  // Improved fetchWeather with better error handling
  const fetchWeather = async () => {
    if (!VITE_WEATHER_API_KEY) {
      throw new Error(
        "Weather API Key is missing in environment variables (VITE_WEATHER_API_KEY)."
      );
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${VITE_WEATHER_API_KEY}&units=metric`;
    const res = await fetch(url);

    if (!res.ok) {
      if (res.status === 404)
        throw new Error(
          `City "${city}" not found. Please check the spelling or try a nearby major city.`
        );
      if (res.status === 401) throw new Error("Invalid Weather API Key.");
      throw new Error(
        `Failed to fetch weather: ${res.statusText} (Status ${res.status})`
      );
    }
    const json = await res.json();
    const weatherData = {
      temp: json.main.temp,
      humidity: json.main.humidity,
      weather: json.weather[0].description,
      name: json.name,
      country: json.sys.country,
    };
    setWeatherInfo(weatherData); // Store for display
    return weatherData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check for API Keys first
    if (!VITE_GEMINI_API_KEY) {
      setError(
        "Gemini API Key is missing in environment variables (VITE_GEMINI_API_KEY)."
      );
      return;
    }
    if (!VITE_WEATHER_API_KEY) {
      // Double check weather key too
      setError(
        "Weather API Key is missing in environment variables (VITE_WEATHER_API_KEY)."
      );
      return;
    }

    setLoading(true);
    setTips([]);
    setError("");
    setWeatherInfo(null);

    try {
      const weather = await fetchWeather(); // Fetch weather first

      // --- Improved Prompt ---
      const prompt = `Act as an expert agricultural advisor.
A farmer is growing "${crop}" in ${weather.name}, ${weather.country}.
The farmer needs advice specifically about "${category}".
${
  specificIssue
    ? `Specific problem described: "${specificIssue}". Address this primarily.`
    : "Provide general tips for the selected category."
}

Current weather conditions: ${weather.temp}°C, ${weather.humidity}% humidity, ${
        weather.weather
      }. Consider how this weather impacts the advice for "${category}". 

**Task:** Provide a list of concise, actionable farming tips relevant to the category, specific issue (if any), crop, location, and current weather.

**Output Format Rules:**
1.  Each distinct tip MUST be on a new line.
2.  **DO NOT use any markdown formatting (like '*', '-', '_', '**', '#', etc.) or bullet point characters.**
3.  Output only the tips, starting directly with the first tip.

Example tip (if category was Irrigation):
Check soil moisture before irrigating, as the ${
        weather.humidity
      }% humidity might reduce evaporation needs.`;
      // --- End of Prompt ---

      console.log("Sending prompt to Gemini:", prompt); // Debugging

      const response = await fetch(
        // Use a modern, capable model
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            // safetySettings: [...] // Optional: Adjust if needed
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
      console.log("Gemini Response:", data); // Debugging

      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      const finishReason = data?.candidates?.[0]?.finishReason;

      if (reply) {
        const parsed = parseTips(reply); // Use the new parsing function
        setTips(parsed);
        if (parsed.length === 0 && reply.trim().length > 0) {
          // AI gave a non-empty response, but parsing failed (maybe unexpected format?)
          setError(
            "Received tips, but couldn't format them into points. Displaying raw response."
          );
          setTips([reply]); // Show raw response as a single "tip" as fallback
          console.warn("Parsing resulted in empty array. Raw reply:", reply);
        } else if (parsed.length === 0) {
          // AI gave an empty response or only whitespace
          setError("The AI didn't provide any specific tips for this request.");
        }
      } else if (finishReason && finishReason !== "STOP") {
        setError(
          `AI generation stopped: ${finishReason}. The prompt might have been blocked.`
        );
      } else {
        setError("No tips were generated by the AI for this request.");
      }
    } catch (err) {
      console.error("Error during tip generation:", err);
      setError(`An error occurred: ${err.message}`);
      setTips([]); // Clear tips on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-100 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-cyan-800">
          🌿 <strong>Smart Farming Tips</strong>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="cropName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <strong>Crop Name</strong>
              </label>
              <input
                id="cropName"
                type="text"
                placeholder="e.g., Rice"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <strong>Location (City/Village)</strong>
              </label>
              <input
                id="location"
                type="text"
                placeholder="e.g., Hanoi"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Input Row 2 */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <strong>Select Tip Category</strong>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white" // Ensure bg is white
              required
            >
              <option value="" disabled>
                -- Select a Category --
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Input Row 3 */}
          <div>
            <label
              htmlFor="specificIssue"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <strong>Specific Issue (Optional)</strong>
            </label>
            <textarea
              id="specificIssue"
              placeholder="e.g., Yellowing leaves, Aphid infestation, When is the best time to harvest?"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={specificIssue}
              onChange={(e) => setSpecificIssue(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Describe any specific problem you are facing in this category.
            </p>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={loading || !crop || !city || !category} // Disable if required fields missing
              className={`block mx-auto border-gray-700 py-3 px-6 rounded-xl font-bold text-lg hover:bg-green-700 transition border-2${
                loading ? "animate-pulse" : ""
              }`}
              aria-live="polite"
            >
              {loading ? (
                <strong>Generating Tips...</strong>
              ) : (
                <strong>Get Smart Tips</strong>
              )}
            </button>
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <div
            role="alert"
            className="mt-6 text-center text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 font-medium"
          >
            <strong>{error}</strong>
          </div>
        )}

        {/* Weather Info Display */}
        {!loading && weatherInfo && (
          <div className="mt-6 bg-blue-50 p-3 rounded-lg border border-blue-200 text-sm text-blue-800">
            <p>
              <span className="font-semibold">Weather context used:</span>{" "}
              {weatherInfo.name}, {weatherInfo.country} ({weatherInfo.temp}°C,{" "}
              {weatherInfo.humidity}% humidity, {weatherInfo.weather})
            </p>
          </div>
        )}

        {/* Tips Display */}
        {!loading && tips.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-cyan-700 border-b pb-2">
              💡 <strong>Recommended Tips:</strong>
            </h2>
            <div className="flex flex-col space-y-3">
              {" "}
              {/* Use flex-col for list view */}
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start p-3 bg-teal-50 border border-teal-200 rounded-lg shadow-sm"
                >
                  <span className="flex-shrink-0 w-5 h-5 mr-3 mt-0.5 text-teal-600">
                    {" "}
                    {/* Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <p className="text-gray-800 text-sm sm:text-base font-bold">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Initial State Message */}
        {!loading && !error && tips.length === 0 && !weatherInfo && (
          <p className="text-center text-gray-500 mt-10">
            Enter crop details and select a category to get tailored farming
            tips.
          </p>
        )}
      </div>
    </div>
  );
};

export default SmartTips;
