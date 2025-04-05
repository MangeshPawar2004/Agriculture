import React, { useState, useRef } from "react";

// Helper to convert file to Base64
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result); // result includes prefix "data:image/...;base64,"
    reader.onerror = (error) => reject(error);
  });

const PlantHealthAnalyzer = () => {
  const [imageFile, setImageFile] = useState(null); // Stores the File object
  const [imageBase64, setImageBase64] = useState(null); // Stores Base64 string for preview & API
  const [analysisResult, setAnalysisResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null); // Ref to access file input

  const VITE_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  // Use a model that supports vision - 1.5 Flash is efficient
  const GEMINI_MODEL = "gemini-1.5-flash-latest";

  // Handle image selection
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setError(""); // Clear previous errors
      setAnalysisResult(""); // Clear previous results
      try {
        const base64 = await fileToBase64(file);
        setImageBase64(base64);
      } catch (err) {
        console.error("Error converting file to Base64:", err);
        setError("Failed to read image file.");
        setImageBase64(null);
        setImageFile(null);
      }
    } else {
      setImageFile(null);
      setImageBase64(null);
      if (file) {
        // if a file was selected but wasn't an image
        setError("Please select a valid image file (JPEG, PNG, WEBP, etc.).");
      }
    }
  };

  // Trigger hidden file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle analysis request
  const handleAnalyze = async () => {
    if (!imageFile || !imageBase64) {
      setError("Please upload an image first.");
      return;
    }
    if (!VITE_GEMINI_API_KEY) {
      setError(
        "Gemini API Key is missing. Please configure environment variables."
      );
      return;
    }

    setLoading(true);
    setError("");
    setAnalysisResult("");

    try {
      // Remove the "data:image/...;base64," prefix for the API call
      const base64Data = imageBase64.split(",")[1];

      const prompt = `You are an expert plant pathologist and agronomist. Analyze the uploaded image of a plant.

Instructions:
1.  **Health Assessment:** Determine if the plant in the image appears healthy or unhealthy. State this clearly (e.g., "Healthy", "Appears Unhealthy", "Difficult to Determine").
2.  **Identify Issue (if unhealthy):** If the plant seems unhealthy, identify the most likely disease, pest infestation, nutrient deficiency, or environmental stress visible in the image. Be specific if possible (e.g., "Possible Powdery Mildew", "Signs of Aphid Infestation", "Nitrogen Deficiency Suspected"). If no issue is clear, state "No specific issue identified".
3.  **Recommended Actions:** Provide a short list of clear, actionable steps the user should take. If unhealthy, focus on remediation specific to the identified issue. If healthy, offer 1-2 general care tips appropriate for a potentially similar plant type (if discernible).
4.  **Format:** Present the response clearly. Use plain text. You can use simple numbered points or headings like "Assessment:", "Issue:", "Recommendations:". **Do not use markdown formatting like '*' or '#'.**

Analyze the provided image now.`;

      const requestBody = {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: imageFile.type, // Use the actual mime type
                  data: base64Data,
                },
              },
            ],
          },
        ],
        // Optional: Add generationConfig if needed
        // generationConfig: { ... }
      };

      console.log("Sending request to Gemini Vision..."); // Debug log

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
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
          `API request failed: ${response.statusText}`;
        console.error("Gemini API Error:", errorData);
        const blockReason = errorData?.promptFeedback?.blockReason;
        if (blockReason) {
          throw new Error(
            `Request blocked by API: ${blockReason}. ${errorMsg}`
          );
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log("Gemini Response:", data); // Debug log

      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      const finishReason = data?.candidates?.[0]?.finishReason;

      if (reply) {
        setAnalysisResult(reply);
      } else if (finishReason && finishReason !== "STOP") {
        setError(`Analysis generation stopped: ${finishReason}.`);
        console.warn("AI Generation stopped unexpectedly:", data);
      } else {
        setError("Received an empty analysis from the AI.");
      }
    } catch (err) {
      console.error("Analysis Error:", err);
      setError(`Analysis failed: ${err.message}`);
      setAnalysisResult(""); // Clear result on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-emerald-50 to-green-100 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-emerald-800">
          🌿 Plant Health Analyzer
        </h1>

        {/* File Upload Section */}
        <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <input
            type="file"
            accept="image/*" // Accept any image type
            onChange={handleImageChange}
            className="hidden" // Hide the default input
            ref={fileInputRef}
            id="plantImageUpload"
          />

          {!imageBase64 && (
            <button
              onClick={handleUploadClick}
              className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-5 py-2 rounded-lg font-medium transition duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 inline-block mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Upload Plant Image
            </button>
          )}

          {/* Image Preview */}
          {imageBase64 && (
            <div className="mt-4 relative group">
              <img
                src={imageBase64}
                alt="Uploaded plant"
                className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-md"
              />
              <button
                onClick={handleUploadClick} // Allow re-upload
                className="absolute top-2 right-2 bg-white/70 hover:bg-white text-gray-800 p-1.5 rounded-full shadow transition opacity-0 group-hover:opacity-100"
                title="Upload new image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Analyze Button */}
        <div className="text-center mb-6">
          <button
            onClick={handleAnalyze}
            disabled={!imageBase64 || loading}
            className={`block mx-auto border-gray-700 py-3 px-6 rounded-xl font-semibold text-lg hover:bg-green-700 transition border-2 ${
              loading ? "animate-pulse" : ""
            }`}
            aria-live="polite"
          >
            {loading ? "Analyzing Image..." : "Analyze Plant Health"}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div
            role="alert"
            className="my-4 text-center text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 font-medium"
          >
            {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="mt-6 text-center text-gray-600">
            <p>Analyzing image, please wait...</p>
            {/* Optional: Add a more visual spinner */}
          </div>
        )}

        {/* Analysis Result Display */}
        {!loading && analysisResult && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-emerald-700 border-b pb-2">
              Analysis Result:
            </h2>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm whitespace-pre-line text-gray-800 text-sm sm:text-base">
              {analysisResult}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center italic">
              Disclaimer: AI analysis provides suggestions and is not a
              substitute for professional diagnosis. Verify findings if unsure.
            </p>
          </div>
        )}

        {/* Initial State Message */}
        {!loading && !error && !analysisResult && !imageBase64 && (
          <p className="text-center text-gray-500 mt-6">
            Upload an image of your plant to get a health analysis.
          </p>
        )}
      </div>
    </div>
  );
};

export default PlantHealthAnalyzer;
