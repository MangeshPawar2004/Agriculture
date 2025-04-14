// src/pages/CropSuggest.jsx

import React, { useState } from "react";
import axios from "axios";
import CropReport from "../components/CropResult"; // Make sure this path is correct

// Define options outside the component for clarity
const waterSourceOptions = [
  "Rainfed",
  "Canal Irrigation",
  "Borewell/Tubewell",
  "River/Lift Irrigation",
  "Tank Irrigation",
  "Drip Irrigation",
  "Sprinkler Irrigation",
];

const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const soilTypeOptions = [
  "Sandy",
  "Loamy",
  "Silty",
  "Clay",
  "Peaty",
  "Chalky",
  "Red Sandy",
  "Black Sandy",
  "Coarse Sand",
  "Fine Sand",
];

const CropSuggest = () => {
  // --- State ---
  const [formData, setFormData] = useState({
    location: "",
    soilType: "",
    rainfall: "",
    preferredDuration: "", // Represents TOTAL duration available
    preferredCrop: "",
    sowingMonth: "", // Added
    waterSources: [], // Added - stores selected water sources
  });

  const [result, setResult] = useState(null); // Stores the parsed JSON result or error object
  const [loading, setLoading] = useState(false);

  // --- Handlers ---
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleWaterSourceToggle = (source) => {
    setFormData((prev) => {
      const currentSources = prev.waterSources;
      if (currentSources.includes(source)) {
        // Remove source
        return {
          ...prev,
          waterSources: currentSources.filter((s) => s !== source),
        };
      } else {
        // Add source
        return { ...prev, waterSources: [...currentSources, source] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null); // Clear previous results

    // --- API Prompt ---
    const prompt = `You are an expert agricultural assistant AI specializing in crop planning and recommendations for specific regional conditions. Your task is to analyze the provided farmer data and recommend the most suitable primary crop, and optionally, a sequential secondary crop if viable within the given timeframe.

**Farmer's Input Data:**
{
  "location": "${formData.location}", // e.g., "Nashik District, Maharashtra"
  "soil_type": "${formData.soilType}", // e.g., "Black Cotton Soil", "Loamy"
  "rainfall_mm": ${formData.rainfall || 0}, // Annual average rainfall in mm
  "preferred_total_duration_available": "${
    formData.preferredDuration
  }", // Total time farmer has (e.g., "180 days", "6 months")
  "preferred_initial_crop": "${
    formData.preferredCrop || "None"
  }", // Farmer's preference, if any
  "planned_sowing_month": "${formData.sowingMonth}", // e.g., "June", "October"
  "available_water_sources": "${
    formData.waterSources.length > 0
      ? formData.waterSources.join(", ")
      : "Not specified, assume primarily Rainfed"
  }" // e.g., "Borewell, Rainfed"
}

**Your Instructions:**

1.  **Primary Crop Recommendation:**
    *   Identify the best primary crop suited for the **location**, **soil type**, **rainfall**, available **water sources**, and the specific **planned sowing month**.
    *   If a **preferred_initial_crop** is given and it's genuinely suitable for *all* these conditions, recommend it. Otherwise, select the best alternative based on agronomic suitability.
    *   Estimate a realistic **duration** for this primary crop (e.g., "90-100 days", "Approx. 4 months").
    *   Determine the likely **sowing season** (e.g., "Kharif", "Rabi", "Zaid", "Early Summer") based on the **planned sowing month** and typical cropping patterns for the **location**.
    *   Provide 3-5 concise, practical **care tips** specific to this crop.
    *   Describe the suitable **climate**.
    *   Detail the **irrigation needs**, explicitly considering the provided **rainfall** and **available water sources**.
    *   Give brief **fertilizer recommendations**.

2.  **Sequential (Secondary) Crop Analysis:**
    *   **Parse Durations:** Accurately extract the numeric duration (in days) for both the primary crop (use the upper end or average if a range is given, e.g., "90-100 days" -> 100 days) and the \`preferred_total_duration_available\` (e.g., "6 months" -> ~180 days). Handle variations like "months".
    *   **Calculate Remaining Time:** Compute \`remaining_duration = preferred_total_duration - primary_crop_duration\`.
    *   **Viability Check:** Determine if this \`remaining_duration\` is substantial enough for another short-cycle crop (rule of thumb: generally > 75 days).
    *   **Seasonality Check:** Critically assess if a *different*, suitable crop can be sown in the season *immediately following* the estimated harvest time of the primary crop (consider primary crop's start month and duration). The secondary crop MUST fit agronomically into this *next* planting window for the given location/climate.
    *   **Include ONLY if Viable:** If BOTH the remaining duration is sufficient AND a suitable crop fits the next season, add the optional \`secondary_crop_suggestion\` object to the main JSON output. This object MUST contain:
        *   \`crop\`: Name of the suggested secondary crop.
        *   \`sowing_season\`: The estimated sowing season for *this secondary crop* (e.g., "Late Kharif", "Rabi", "Early Zaid").
        *   \`duration\`: Estimated duration for *this secondary crop*.
    *   **Omit if Not Viable:** If EITHER the remaining duration is too short OR no suitable crop fits the subsequent planting season, **completely OMIT** the \`secondary_crop_suggestion\` key and its value from the final JSON output.

3.  **Output Format:**
    *   Generate **ONLY** a single, raw, valid JSON object adhering strictly to the structure below.
    *   **ABSOLUTELY NO** introductory text, explanations, apologies, markdown (like \`\`\`), bullet points outside JSON arrays, or any other text outside the JSON structure.
    *   The entire response must be parseable by \`JSON.parse()\`.

**Required Output JSON Structure:**
\`\`\`json
{
  "crop": "string", // Name of the PRIMARY recommended crop
  "sowing_season": "string", // e.g., "Kharif", "Rabi", "Summer" for the PRIMARY crop
  "duration": "string", // Estimated duration for the PRIMARY crop (e.g., "90-100 days")
  "care_tips": [ // 3-5 concise tips for the PRIMARY crop
    "string",
    "string",
    "string"
  ],
  "climate": "string", // Climate suitability for the PRIMARY crop
  "irrigation_needs": "string", // Irrigation advice for PRIMARY crop considering inputs
  "fertilizer_recommendations": "string", // Fertilizer advice for PRIMARY crop
  "secondary_crop_suggestion": { // <<< THIS KEY IS OPTIONAL - OMIT ENTIRELY IF NOT APPLICABLE
      "crop": "string", // Name of the suggested SECONDARY crop
      "sowing_season": "string", // Estimated sowing season for the SECONDARY crop (e.g., "Rabi", "Late Kharif")
      "duration": "string" // Estimated duration for the SECONDARY crop (e.g., "Approx. 70 days")
   }
}
\`\`\`
`; // --- End of Prompt ----- End of Prompt ---
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "Gemini API Key is missing. Please check environment variables."
        );
      }
      // Use a capable model, 1.5 Flash is good
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

      console.log("Sending Prompt:", prompt); // Log the prompt for debugging

      const response = await axios.post(
        apiUrl,
        {
          contents: [{ parts: [{ text: prompt }] }],
          // Optional: Add generation config if needed
          // generationConfig: { temperature: 0.7, topP: 0.9 }
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Robust check for response data structure
      const candidate = response.data?.candidates?.[0];
      const reply = candidate?.content?.parts?.[0]?.text;
      const finishReason = candidate?.finishReason;

      console.log("Raw reply from Gemini:", reply);
      console.log("Finish Reason:", finishReason);

      if (reply) {
        let parsed;
        try {
          // Attempt to extract JSON even if surrounded by text/markdown
          const jsonMatch = reply.match(
            /```json\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/
          ); // Look for markdown block first, then standalone {}
          if (jsonMatch) {
            // Take the content inside markdown ```json ... ``` (group 1) or the standalone object (group 2)
            const jsonString = jsonMatch[1] || jsonMatch[2];
            parsed = JSON.parse(jsonString);
            console.log("Parsed JSON:", parsed);
          } else {
            // If no JSON structure found in the reply
            console.error("No valid JSON structure found in the reply.");
            throw new Error("Could not find JSON in the AI response.");
          }
        } catch (parseError) {
          console.error("Failed to parse JSON:", parseError);
          console.error("Problematic Reply:", reply); // Log the reply that failed parsing
          // Try to provide some feedback even if parsing fails
          parsed = {
            error: `Failed to parse suggestion. The AI might have provided an invalid format. Raw response might be in console.`,
            // Provide empty defaults so CropReport doesn't crash
            crop: "Parsing Error",
            sowing_season: "",
            duration: "",
            care_tips: [],
            climate: "",
            irrigation_needs: "",
            fertilizer_recommendations: "",
          };
        }
        // Check if secondary crop exists but lacks required fields (optional data integrity check)
        if (
          parsed.secondary_crop_suggestion &&
          (!parsed.secondary_crop_suggestion.crop ||
            !parsed.secondary_crop_suggestion.sowing_season ||
            !parsed.secondary_crop_suggestion.duration)
        ) {
          console.warn(
            "Secondary crop suggestion from AI is incomplete:",
            parsed.secondary_crop_suggestion
          );
          // Decide if you want to remove it or display as is
          // delete parsed.secondary_crop_suggestion; // Option: remove incomplete secondary suggestion
        }

        setResult(parsed);
      } else if (finishReason && finishReason !== "STOP") {
        console.error(
          "Gemini API call stopped unexpectedly:",
          finishReason,
          response.data
        );
        let stopErrorMsg = `Suggestion generation stopped: ${finishReason}.`;
        if (finishReason === "SAFETY") {
          stopErrorMsg +=
            " The prompt or response might have been blocked due to safety filters.";
        } else if (finishReason === "MAX_TOKENS") {
          stopErrorMsg += " The response was too long.";
        }
        setResult({ error: stopErrorMsg });
      } else {
        console.error("No reply text found in response:", response.data);
        setResult({ error: "No suggestion received from the AI." });
      }
    } catch (err) {
      console.error("API error:", err.response?.data || err.message || err); // Log detailed error
      let errorMsg = "Something went wrong while fetching the suggestion.";
      if (err.response?.data?.error?.message) {
        errorMsg = `API Error: ${err.response.data.error.message}`;
      } else if (err.message) {
        // Catch errors like missing API key
        errorMsg = err.message;
      }
      setResult({ error: errorMsg }); // Set error state in result
    } finally {
      setLoading(false);
    }
  };

  // --- Render JSX ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-green-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        {/* Increased max-width */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-800 mb-4">
            Smart Crop Suggestion
          </h1>
          <p className="text-lg text-green-600">
            Get personalized crop recommendations based on your farming
            conditions
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-200">
            {/* Use a 3-column grid for wider layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
              {" "}
              {/* Adjusted gap */}
              {/* Column 1 */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
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
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-200"
                    placeholder="e.g., Pune District, Maharashtra"
                  />
                </div>
                <div>
                  <label
                    htmlFor="rainfall"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Avg. Annual Rainfall (mm)
                  </label>
                  <input
                    type="number"
                    name="rainfall"
                    id="rainfall"
                    value={formData.rainfall}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-200"
                    placeholder="e.g., 850"
                  />
                </div>
                <div>
                  <label
                    htmlFor="preferredCrop"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Preferred Crop (Optional)
                  </label>
                  <input
                    type="text"
                    name="preferredCrop"
                    id="preferredCrop"
                    value={formData.preferredCrop}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-200"
                    placeholder="e.g. Rice"
                  />
                </div>
              </div>
              {/* Column 2 */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="soilType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Soil Type
                  </label>
                  <select
                    name="soilType"
                    id="soilType"
                    value={formData.soilType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-200 bg-white"
                  >
                    <option value="" disabled>
                      -- Select Soil Type --
                    </option>
                    {soilTypeOptions.map((soil) => (
                      <option key={soil} value={soil}>
                        {soil}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="sowingMonth"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Planned Sowing Month
                  </label>
                  <select
                    name="sowingMonth"
                    id="sowingMonth"
                    value={formData.sowingMonth}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-200 bg-white"
                  >
                    <option value="" disabled>
                      -- Select Sowing Month --
                    </option>
                    {monthOptions.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="preferredDuration"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Available Duration (Total)
                  </label>
                  <input
                    type="text"
                    name="preferredDuration"
                    id="preferredDuration"
                    value={formData.preferredDuration}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-200"
                    placeholder="e.g., 180 days, 6 months"
                  />
                </div>
              </div>
              {/* Column 3 - Water Sources */}
              <div className="space-y-2">
                {" "}
                {/* Reduced space for checkboxes */}
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Water Sources
                </label>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-2 border border-gray-200 rounded-lg p-2">
                  {" "}
                  {/* Scrollable if many options */}
                  {waterSourceOptions.map((source) => (
                    <label
                      key={source}
                      className={`flex items-center cursor-pointer px-3 py-1.5 rounded-md border transition-all duration-200 ${
                        formData.waterSources.includes(source)
                          ? "bg-green-100 border-green-300 ring-1 ring-green-200"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={source}
                        className="hidden" // Hide checkbox visually
                        checked={formData.waterSources.includes(source)}
                        onChange={() => handleWaterSourceToggle(source)}
                      />
                      {/* Custom Checkbox Look */}
                      <span
                        className={`w-4 h-4 mr-2 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors duration-200 ${
                          formData.waterSources.includes(source)
                            ? "bg-green-500 border-green-500"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {formData.waterSources.includes(source) && (
                          <svg
                            className="w-2.5 h-2.5 text-white fill-current"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"></path>
                          </svg>
                        )}
                      </span>
                      <span className="text-xs font-medium text-gray-700">
                        {source}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1 px-1">
                  Select all that apply.
                </p>
              </div>
            </div>{" "}
            {/* End Grid */}
            {/* Submit Button */}
            <div className="mt-10 flex justify-center">
              <button
                type="submit"
                className={`px-8 py-3 rounded-xl text-base font-bold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  loading ||
                  !formData.sowingMonth ||
                  !formData.location ||
                  !formData.soilType ||
                  !formData.rainfall ||
                  !formData.preferredDuration
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
                disabled={
                  loading ||
                  !formData.sowingMonth ||
                  !formData.location ||
                  !formData.soilType ||
                  !formData.rainfall ||
                  !formData.preferredDuration
                } // Update disabled logic
                aria-live="polite"
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
          </div>{" "}
          {/* End Form Card */}
        </form>
        {/* Result Display Area */}
        <div className="mt-12">
          {/* Display Loading Placeholder */}
          {loading && (
            <div className="text-center p-6 bg-white rounded-lg shadow">
              <p className="text-lg text-gray-600 animate-pulse">
                Fetching recommendations...
              </p>
            </div>
          )}

          {/* Display Result or Error */}
          {!loading && result && (
            <div className="transition-opacity duration-500 ease-in opacity-100">
              {/* Display Primary Crop Report (handles its own error display if result.error exists) */}
              <CropReport data={result} />

              {/* Conditionally Display Secondary Crop Suggestion if no primary error and secondary exists */}
              {!result.error && result.secondary_crop_suggestion && (
                <div className="mt-10 bg-white rounded-2xl shadow-lg p-6 border border-blue-200 animate-fade-in">
                  {" "}
                  {/* Added animation class */}
                  <h3 className="text-xl font-bold text-blue-700 border-b border-blue-300 pb-2 mb-4">
                    Follow-up Crop Suggestion
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100">
                      <h4 className="font-semibold text-blue-800 mb-1">
                        Crop Name
                      </h4>
                      <p className="text-gray-700">
                        {result.secondary_crop_suggestion.crop || "N/A"}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100">
                      <h4 className="font-semibold text-blue-800 mb-1">
                        Est. Sowing Season
                      </h4>
                      <p className="text-gray-700">
                        {result.secondary_crop_suggestion.sowing_season ||
                          "N/A"}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100">
                      <h4 className="font-semibold text-blue-800 mb-1">
                        Est. Duration
                      </h4>
                      <p className="text-gray-700">
                        {result.secondary_crop_suggestion.duration || "N/A"}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-4 italic">
                    Disclaimer: This is a potential follow-up crop based on
                    estimated durations. Verify suitability for your specific
                    field conditions, the exact harvest time of the primary
                    crop, and the actual climate of the subsequent season before
                    planting.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropSuggest;

// Add this to your index.css or global CSS file for the fade-in animation:
/*
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}
*/
