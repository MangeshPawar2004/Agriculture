import React, { useState, useEffect } from "react";

// Helper function to parse the text response
// This assumes the AI generally follows the "Number. Heading" format
const parseBestPractices = (text) => {
  if (!text) return [];

  const sections = [];
  // Regex to find lines starting with "Number. Heading Text" (adjust if AI format differs)
  // It captures the title part (group 2)
  const headingRegex = /^\s*(\d+)\.\s+(.*?)\s*$/gm;
  let match;
  let lastIndex = 0;
  const potentialSections = [];

  // First pass: Find all potential headings and their start indices
  while ((match = headingRegex.exec(text)) !== null) {
    potentialSections.push({
      title: match[2].trim(), // The text after "Number. "
      index: match.index,
      fullMatch: match[0], // The full "Number. Title" line
    });
  }

  // Second pass: Extract content between headings
  for (let i = 0; i < potentialSections.length; i++) {
    const currentSection = potentialSections[i];
    // Start index is after the current heading line
    const startIndex = currentSection.index + currentSection.fullMatch.length;
    // End index is the start of the next heading, or end of the text
    const endIndex =
      i + 1 < potentialSections.length
        ? potentialSections[i + 1].index
        : text.length;

    // Extract the content block for this section
    const contentBlock = text.substring(startIndex, endIndex).trim();

    // Split the block into points/lines, removing empty lines and potential markdown bullets
    const points = contentBlock
      .split("\n")
      .map((line) => line.trim().replace(/^[-*•]\s*/, "")) // Remove leading list markers like -, *, •
      .filter((line) => line.length > 0); // Filter out empty lines

    // Only add the section if it has a title and some points
    if (currentSection.title && points.length > 0) {
      sections.push({
        title: currentSection.title,
        points: points,
      });
    }
  }

  // Fallback: If no sections were parsed (maybe AI didn't use numbers),
  // treat the whole response as one section, splitting by lines.
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
  const [response, setResponse] = useState(""); // Still store raw response if needed
  const [parsedPractices, setParsedPractices] = useState([]); // State for structured data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Parse the response whenever it changes
  useEffect(() => {
    if (response) {
      const parsedData = parseBestPractices(response);
      setParsedPractices(parsedData);
      // Check if parsing failed to produce sections from a non-empty response
      if (parsedData.length === 0 && response.trim().length > 0) {
        console.warn(
          "Parsing might have failed to structure the response. Displaying raw text as fallback."
        );
        // You could set a specific state here to show the raw text if parsing fails
      }
    } else {
      setParsedPractices([]); // Clear parsed data if response is cleared
    }
  }, [response]); // Dependency array includes response

  const handleFetchBestPractices = async () => {
    setLoading(true);
    setError("");
    setResponse(""); // Clear previous raw response
    setParsedPractices([]); // Clear previous parsed data

    // Consider making the prompt even more explicit about structure
    const prompt = `You are an agricultural expert providing guidance.
Generate detailed best farming practices for growing ${crop}.
Strictly follow this structure, using these exact headings preceded by numbers and followed by bullet points (using '*' or '-'):

1. Soil Selection and Preparation
* Point 1
* Point 2
...
2. Sowing (Planting)
* Point 1
...
3. Irrigation
* Point 1
...
4. Fertilization
* Point 1
...
5. Weed Management
* Point 1
...
6. Pest and Disease Management
* Point 1
...
7. Harvesting
* Point 1
...
8. Key Tips for Success
* Point 1
...

Provide concise, actionable advice under each heading. Ensure clear separation between sections.`;

    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
          // Using gemini-pro might give better structure following
          import.meta.env.VITE_GEMINI_API_KEY
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            // Optional: Add generation config for potentially better results
            /*
             generationConfig: {
                temperature: 0.6,
                topK: 40,
                topP: 0.9,
             }
             */
          }),
        }
      );

      if (!geminiRes.ok) {
        const errorData = await geminiRes.json();
        console.error("API Error:", errorData);
        throw new Error(
          errorData.error?.message ||
            `API request failed with status ${geminiRes.status}`
        );
      }

      const data = await geminiRes.json();
      // Adjust access based on potential Gemini API response structure variations
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (reply) {
        setResponse(reply); // Update raw response -> useEffect will trigger parsing
      } else {
        console.warn("Received empty or unexpected response structure:", data);
        setError(
          "No guidance found or response format issue. Please try again."
        );
        setResponse(""); // Ensure response is cleared
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(`Something went wrong: ${err.message}`);
      setResponse(""); // Ensure response is cleared on error
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

        <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-6">
          <input
            type="text"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            placeholder="Enter crop name (e.g., Tomato)"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
            aria-label="Crop Name Input"
          />
          <button
            onClick={handleFetchBestPractices}
            disabled={!crop || loading}
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

        {/* Render the parsed sections */}
        {loading && !parsedPractices.length && (
          <div className="mt-6 text-center text-gray-500">
            Loading practices...
          </div>
        )}

        {!loading && parsedPractices.length > 0 && (
          <div className="mt-8 space-y-6">
            {parsedPractices.map((section, index) => (
              <div
                key={index}
                className="p-4 bg-lime-50 border border-lime-200 rounded-lg shadow-sm transition-all hover:shadow-md"
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

        {/* Optional: Show raw response if parsing fails but response exists */}
        {/* {!loading && !error && parsedPractices.length === 0 && response && (
           <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-inner whitespace-pre-line text-gray-800">
             <h3 className="font-semibold text-yellow-800 mb-2">Raw Guidance (Could not structure):</h3>
             {response}
           </div>
        )} */}

        {!loading && !error && !response && !crop && (
          <p className="text-center text-gray-500 mt-6">
            Enter a crop name above to get farming best practices.
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
