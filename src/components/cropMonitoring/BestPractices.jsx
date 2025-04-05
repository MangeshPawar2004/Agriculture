import React, { useState } from "react";

const BestPracticesPage = () => {
  const [crop, setCrop] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchBestPractices = async () => {
    setLoading(true);
    setError("");
    setResponse("");

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
            contents: [
              {
                parts: [
                  {
                    text: `Provide best farming practices for growing ${crop}, including sowing, irrigation, fertilization, pest control, and harvesting tips.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await geminiRes.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (reply) {
        setResponse(reply);
      } else {
        setError("No guidance found. Please try another crop.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching guidance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-bold text-green-800 mb-4 text-center">
          🌾 Crop-Specific Best Practices
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            placeholder="Enter crop name (e.g., Wheat)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <button
            onClick={handleFetchBestPractices}
            disabled={!crop || loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transition-all"
          >
            {loading ? "Fetching..." : "Get Guidance"}
          </button>
        </div>

        {error && <p className="text-red-600 font-medium">{error}</p>}

        {response && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg shadow-inner whitespace-pre-line text-gray-800">
            {response}
          </div>
        )}
      </div>
    </div>
  );
};

export default BestPracticesPage;
