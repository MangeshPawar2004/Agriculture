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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center text-green-700">
        Crop Suggestion Tool
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="location"
          placeholder="Enter your location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="text"
          name="soilType"
          placeholder="Soil Type (e.g., Loamy, Sandy)"
          value={formData.soilType}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="number"
          name="rainfall"
          placeholder="Rainfall (in mm)"
          value={formData.rainfall}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="text"
          name="preferredDuration"
          placeholder="Preferred crop duration (e.g., 90 days)"
          value={formData.preferredDuration}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="text"
          name="preferredCrop"
          placeholder="Any crop preference? (optional)"
          value={formData.preferredCrop}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded w-full hover:bg-green-700"
        >
          {loading ? "Generating..." : "Get Crop Suggestion"}
        </button>
      </form>

      {result && <CropReport data={result} />}
    </div>
  );
};

export default CropSuggest;
