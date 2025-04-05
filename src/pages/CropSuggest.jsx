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
      "rainfall_mm": ${formData.rainfall}, // Assuming rainfall is a number
      "preferred_duration": "${formData.preferredDuration}",
      "preferred_crop": "${formData.preferredCrop || "None"}"
    }
    
    Generate a single, valid JSON object containing the recommendation details. Adhere *strictly* to the specified keys and data types below.
    
    Prioritize crops well-suited to the given location, soil type, and rainfall.
    Consider the preferred duration.
    If a preferred crop is specified ('None' means no preference) and it is suitable for the conditions, prioritize recommending it. If it's unsuitable, choose the best alternative based on the other factors.
    
    The JSON object must have the following structure and data types:
    {
      "crop": "string", // The common name of the recommended crop.
      "sowing_season": "string", // The optimal sowing season(s) for the crop in the likely climate zone (e.g., "Spring", "Early Summer", "Kharif", "Rabi").
      "duration": "string", // Estimated time from sowing to harvest (e.g., "90-100 days", "6 months"). Try to match preferred_duration if feasible.
      "care_tips": [ // An array of 3-5 brief, actionable care tips specific to the recommended crop.
        "string",
        "string",
        // ... more tips
      ],
      "climate": "string", // General climate suitability for the crop (e.g., "Warm and humid", "Temperate", "Requires sunny days and cool nights"). Ensure this matches the input data context.
      "irrigation_needs": "string", // Description of water requirements (e.g., "Requires consistent moisture, supplement rainfall", "Drought-tolerant once established", "Moderate watering needed"). Relate this to the provided rainfall_mm if possible.
      "fertilizer_recommendations": "string" // Brief guidance on fertilizer type or timing (e.g., "Balanced NPK at planting", "Prefers compost-rich soil", "Top-dress with Nitrogen during growth"). Consider the soil_type if relevant.
    }
    
    IMPORTANT: Output *only* the raw JSON object. Do not include any introductory text, explanation, markdown formatting (like \`\`\`json), or concluding remarks. The output must be parseable by JSON.parse().
    `;

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
      let parsed;
      try {
        parsed = JSON.parse(reply);
      } catch {
        parsed = { crop: reply }; // fallback
      }

      setResult(parsed);
    } catch (err) {
      console.error(err);
      setResult({
        error: "Something went wrong while fetching the suggestion.",
      });
    } finally {
      setLoading(false);
    }
  };

  const apiResponseData = {
    crop: "Pearl Millet (Bajra)",
    sowing_season: "Kharif",
    duration: "90-120 days",
    care_tips: [
      "Ensure well-drained soil to prevent waterlogging.",
      "Thin seedlings to maintain optimal plant spacing.",
      "Monitor for pests like shoot fly and stem borer.",
      "Harvest when grains are hard and stalks begin to dry.",
      "Apply organic mulch to conserve soil moisture.",
    ],
    climate: "Warm and dry",
    irrigation_needs:
      "Drought-tolerant; supplemental irrigation beneficial during critical growth stages, especially with low rainfall.",
    fertilizer_recommendations:
      "Apply basal dose of nitrogen and phosphorus; top-dress with nitrogen after first weeding.",
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

      {apiResponseData && <CropReport data={apiResponseData} />}
    </div>
  );
};

export default CropSuggest;
