import React, { useState, useRef } from "react";
import axios from "axios";

const VITE_HF_API_KEY = import.meta.env.VITE_HF_API_KEY;
const VITE_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const HUGGINGFACE_MODEL = "Diginsa/Plant-Disease-Detection-Project";
const GEMINI_MODEL = "gemini-2.0-flash";

const PlantHealthAnalyzer = () => {
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disease, setDisease] = useState("");
  const [geminiAdvice, setGeminiAdvice] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
      setDisease("");
      setGeminiAdvice("");
    };
    reader.readAsDataURL(file);
  };

  const parseAdviceSections = (text) => {
    const sections = {};
    let current = "";
    const lines = text.split("\n").map((line) => line.trim());

    for (const line of lines) {
      if (/overview/i.test(line)) current = "🧬 Overview";
      else if (/symptom/i.test(line)) current = "🩺 Symptoms";
      else if (/prevent/i.test(line)) current = "🛡️ Prevention";
      else if (/treatment/i.test(line)) current = "💊 Treatment";
      else if (/medicine/i.test(line)) current = "💉 Medicines";
      else if (current) {
        sections[current] = (sections[current] || "") + line + "\n";
      }
    }

    return sections;
  };

  const analyzeDisease = async () => {
    if (!imageBase64) return;
    setLoading(true);
    setError("");
    setGeminiAdvice("");
    setDisease("");

    try {
      const base64Data = imageBase64.split(",")[1];

      // Step 1: Predict with Hugging Face
      const hfResponse = await axios.post(
        `https://api-inference.huggingface.co/models/${HUGGINGFACE_MODEL}`,
        {
          inputs: {
            image: base64Data,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${VITE_HF_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const predictedLabel = hfResponse.data?.[0]?.label || "Unknown";
      setDisease(predictedLabel);

      // Step 2: Generate Gemini Advice
      const prompt = `The detected crop disease is: ${predictedLabel}.
Provide the following clearly in plain text (no markdown):
1. Overview of the disease
2. Common symptoms
3. Preventive measures
4. Treatment techniques
5. Common medicines used

Each section should be clearly labeled on a new line (like Overview:, Symptoms:, etc). 
Dont use any Markdown or # or *, instead use plain text and number for each section and points.
`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const geminiData = await geminiRes.json();
      const reply =
        geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setGeminiAdvice(reply);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
        🌿 Plant Disease Detector
      </h2>

      {/* Upload Box */}
      <div className="bg-white border border-gray-300 rounded-xl shadow-md p-6 text-center mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
          id="upload"
        />
        {!imageBase64 ? (
          <label
            htmlFor="upload"
            className="cursor-pointer text-green-700 font-medium hover:underline"
          >
            📷 Click to upload plant image
          </label>
        ) : (
          <div className="relative">
            <img
              src={imageBase64}
              alt="Uploaded"
              className="mx-auto rounded-lg shadow max-h-60"
            />
            <button
              onClick={() => {
                fileInputRef.current.click();
              }}
              className="mt-3 bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200 transition"
            >
              Change Image
            </button>
          </div>
        )}
      </div>

      {/* Analyze Button */}
      <div className="text-center mb-6">
        <button
          onClick={analyzeDisease}
          className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition"
          disabled={loading || !imageBase64}
        >
          {loading ? "Analyzing..." : "Analyze Disease"}
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {/* Prediction */}
      {disease && (
        <div className="mb-8 p-4 bg-yellow-100 text-yellow-900 rounded-md border border-yellow-300 shadow">
          <h3 className="text-lg font-semibold mb-1">🦠 Detected Disease:</h3>
          <p>{disease}</p>
        </div>
      )}

      {/* Gemini Advice */}
      {geminiAdvice && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-green-800 text-center">
            💡 Disease Management Advice
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Object.entries(parseAdviceSections(geminiAdvice)).map(
              ([section, content], idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-xl border border-green-200 shadow hover:shadow-lg transition"
                >
                  <h4 className="text-lg font-semibold text-green-700 mb-2">
                    {section}
                  </h4>
                  <p className="text-gray-700 whitespace-pre-line text-sm">
                    {content.trim()}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantHealthAnalyzer;
