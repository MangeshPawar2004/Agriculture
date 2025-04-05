import React, { useState, useEffect } from "react";

// Helper function to parse the AI response
const parseBestPractices = (text) => {
  if (!text) return [];

  const sections = [];
  const headingRegex = /^\s*(\d+)\.\s+(.*?)\s*$/gm;
  let match;
  const potentialSections = [];

  while ((match = headingRegex.exec(text)) !== null) {
    potentialSections.push({
      title: match[2].trim(),
      index: match.index,
      fullMatch: match[0],
    });
  }

  for (let i = 0; i < potentialSections.length; i++) {
    const current = potentialSections[i];
    const startIndex = current.index + current.fullMatch.length;
    const endIndex =
      i + 1 < potentialSections.length
        ? potentialSections[i + 1].index
        : text.length;

    const contentBlock = text.substring(startIndex, endIndex).trim();
    const points = contentBlock
      .split("\n")
      .map((line) => line.trim().replace(/^[-*•]\s*/, ""))
      .filter((line) => line.length > 0);

    if (current.title && points.length > 0) {
      sections.push({
        title: current.title,
        points: points,
      });
    }
  }

  if (sections.length === 0 && text.trim().length > 0) {
    const fallbackPoints = text
      .split("\n")
      .map((line) => line.trim().replace(/^[-*•]\s*/, ""))
      .filter((line) => line.length > 0);
    if (fallbackPoints.length > 0) {
      return [{ title: "General Guidance", points: fallbackPoints }];
    }
  }

  return sections;
};

const BestPracticesPage = () => {
  const [crop, setCrop] = useState("");
  const [cropAge, setCropAge] = useState("");
  const [response, setResponse] = useState("");
  const [parsedPractices, setParsedPractices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (response) {
      const parsedData = parseBestPractices(response);
      setParsedPractices(parsedData);
    } else {
      setParsedPractices([]);
    }
  }, [response]);

  const handleFetchBestPractices = async () => {
    setLoading(true);
    setError("");
    setResponse("");
    setParsedPractices([]);

    const prompt = `You are an agricultural expert providing practical guidance.
Generate detailed best farming practices for growing "${crop}", specifically considering the crop is currently ${cropAge} days old.

Strictly follow this structure, using these exact numbered headings.
Under each heading, provide individual points of advice. Each point should be on a new line.
**DO NOT use any markdown formatting (like "-", "*", "_", "**", etc.) within the advice points.** Just provide the plain text for each piece of advice.

1. Soil Selection and Preparation
Point 1 text
Point 2 text
...
2. Sowing (Planting)
Point 1 text
Point 2 text
...
3. Irrigation
Point 1 text (Focus on needs at ${cropAge} days)
...
4. Fertilization
Point 1 text (Focus on needs at ${cropAge} days)
...
5. Weed Management
Point 1 text (Focus on methods relevant at ${cropAge} days)
...
6. Pest and Disease Management
Point 1 text (Focus on risks/actions at ${cropAge} days)
...
7. Harvesting
Point 1 text (Mention indicators, even if far off)
...
8. Key Tips for Success
Point 1 text (General or age-specific tips)
...

Ensure the advice under Irrigation, Fertilization, Weed Management, and Pest/Disease Management is particularly relevant to the crop's current age (${cropAge} days). Be precise, practical, and farmer-friendly. Output only the structured text as requested.`;

    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
          import.meta.env.VITE_GEMINI_API_KEY
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!geminiRes.ok) {
        const errorData = await geminiRes.json();
        throw new Error(
          errorData.error?.message ||
            `API request failed with status ${geminiRes.status}`
        );
      }

      const data = await geminiRes.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (reply) {
        setResponse(reply);
      } else {
        setError("Empty response received from the AI. Please try again.");
      }
    } catch (err) {
      setError(`Something went wrong: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-green-50 to-lime-50">
      <div className="max-w-4xl mx-auto bg-white p-5 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-5 text-center">
          🌾 Crop-Specific Best Practices
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-6">
          <input
            type="text"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            placeholder="Enter crop name (e.g., Tomato)"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="number"
            value={cropAge}
            onChange={(e) => setCropAge(e.target.value)}
            placeholder="Age in days"
            min="0"
            className="w-40 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleFetchBestPractices}
            disabled={!crop || !cropAge || loading}
            className={`bg-green-600 hover:bg-green-700  px-5 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
              loading ? "animate-pulse" : ""
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                Fetching...
              </>
            ) : (
              "Get Guidance"
            )}
          </button>
        </div>

        {error && (
          <div className="my-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && parsedPractices.length > 0 && (
          <div className="mt-8 space-y-6">
            {parsedPractices.map((section, index) => (
              <div
                key={index}
                className="p-4 bg-lime-50 border border-lime-200 rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-green-700 mb-3 border-b border-green-200 pb-1">
                  {section.title}
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-gray-800 text-sm sm:text-base">
                  {section.points.map((point, pIndex) => (
                    <li key={pIndex}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && !response && !crop && (
          <p className="text-center text-gray-500 mt-6">
            Enter a crop name and age to get farming best practices.
          </p>
        )}

        {!loading && !error && !response && crop && !parsedPractices.length && (
          <p className="text-center text-gray-500 mt-6">
            Click "Get Guidance" to fetch practices for {crop}.
          </p>
        )}
      </div>
    </div>
  );
};

export default BestPracticesPage;
