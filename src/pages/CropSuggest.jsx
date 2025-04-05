import React, { useState } from "react";
import axios from "axios";
import CropReport from "../components/CropResult";

const CropSuggest = () => {
  const [formData, setFormData] = useState({
    location: "",
    soilType: "",
    rainfall: "",
    preferredDuration: "",
    preferredCrop: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const prompt = `You are an expert agricultural assistant AI. Your task is to analyze the provided user data and recommend the most suitable crop.

Based *only* on the following user data:
{
  "location": "${formData.location}",
  "soil_type": "${formData.soilType}",
  "rainfall_mm": ${formData.rainfall},
  "preferred_duration": "${formData.preferredDuration}",
  "preferred_crop": "${formData.preferredCrop || "None"}"
}

Generate a single, valid JSON object containing the recommendation details. Adhere *strictly* to the specified keys and data types below.

Prioritize crops well-suited to the given location, soil type, and rainfall.
Consider the preferred duration.
If a preferred crop is specified ('None' means no preference) and it is suitable for the conditions, prioritize recommending it. If it's unsuitable, choose the best alternative based on the other factors.

The JSON object must have the following structure and data types:
{
  "crop": "string",
  "sowing_season": "string",
  "duration": "string",
  "care_tips": [
    "string",
    "string",
    "string"
  ],
  "climate": "string",
  "irrigation_needs": "string",
  "fertilizer_recommendations": "string"
}

IMPORTANT: Output *only* the raw JSON object. Do not include any introductory text, explanation, markdown formatting (like \`\`\`json), or concluding remarks. The output must be parseable by JSON.parse().`;

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const reply =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ??
        "No suggestion received.";
      console.log("Raw reply from Gemini:", reply);

      let parsed;
      try {
        const jsonMatch = reply.match(/\{[\s\S]*\}/);
        parsed = jsonMatch
          ? JSON.parse(jsonMatch[0])
          : { crop: "Could not parse suggestion." };
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        parsed = { crop: "Error parsing suggestion." };
      }

      setResult(parsed);
    } catch (err) {
      console.error("API error:", err);
      setResult({
        error: "Something went wrong while fetching the suggestion.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            Smart Crop Suggestion
          </h1>
          <p className="text-lg text-green-600">
            Get personalized crop recommendations based on your farming
            conditions
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-lg font-semibold text-green-800 mb-2"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                    placeholder="e.g. Maharashtra"
                  />
                </div>

                <div>
                  <label
                    htmlFor="soilType"
                    className="block text-lg font-semibold text-green-800 mb-2"
                  >
                    Soil Type
                  </label>
                  <select
                    name="soilType"
                    id="soilType"
                    value={formData.soilType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                  >
                    <option value="">-- Select Soil Type --</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Loamy">Loamy</option>
                    <option value="Silty">Silty</option>
                    <option value="Clay">Clay</option>
                    <option value="Peaty">Peaty</option>
                    <option value="Chalky">Chalky</option>
                    <option value="Red Sandy">Red Sandy</option>
                    <option value="Black Sandy">Black Sandy</option>
                    <option value="Coarse Sand">Coarse Sand</option>
                    <option value="Fine Sand">Fine Sand</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="rainfall"
                    className="block text-lg font-semibold text-green-800 mb-2"
                  >
                    Rainfall (mm)
                  </label>
                  <input
                    type="number"
                    name="rainfall"
                    id="rainfall"
                    value={formData.rainfall}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                    placeholder="e.g. 850"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="preferredDuration"
                    className="block text-lg font-semibold text-green-800 mb-2"
                  >
                    Preferred Duration
                  </label>
                  <input
                    type="text"
                    name="preferredDuration"
                    id="preferredDuration"
                    value={formData.preferredDuration}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                    placeholder="e.g. 90 days"
                  />
                </div>

                <div>
                  <label
                    htmlFor="preferredCrop"
                    className="block text-lg font-semibold text-green-800 mb-2"
                  >
                    Preferred Crop (optional)
                  </label>
                  <input
                    type="text"
                    name="preferredCrop"
                    id="preferredCrop"
                    value={formData.preferredCrop}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                    placeholder="e.g. Rice"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <button
                type="submit"
                className={`px-8 py-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-300 shadow-lg ${
                  loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
                disabled={loading}
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
                    Generating...
                  </span>
                ) : (
                  "Get Crop Suggestion"
                )}
              </button>
            </div>
          </div>
        </form>

        {result && (
          <div className="mt-12 transform transition-all duration-500">
            <CropReport data={result} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CropSuggest;
