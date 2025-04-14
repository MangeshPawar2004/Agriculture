import React from "react";
import { Link } from "react-router-dom";

const CropMonitoring = () => {
  const cards = [
    {
      title: "✅ Best Practices",
      color: "green",
      to: "/crop-monitoring/best-practices",
      emoji: "✅",
    },
    {
      title: "🌦️ 7-Day Weather Forecast",
      color: "blue",
      to: "/crop-monitoring/weather-forecast",
      emoji: "🌦️",
    },
    {
      title: "💧 Smart Resource Optimization",
      color: "indigo",
      to: "/crop-monitoring/resource-optimizer",
      emoji: "💧",
    },
    {
      title: "🔍 Crop Health Detection",
      color: "red",
      to: "/crop-monitoring/crop-health",
      emoji: "🔍",
    },
    {
      title: "🧠 AI-Powered Smart Tips",
      color: "purple",
      to: "/crop-monitoring/smart-tips",
      emoji: "🧠",
    },
  ];

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black">
      <h1 className="text-4xl font-extrabold text-green-800 text-center mb-12 tracking-tight">
        🌿 Crop Monitoring Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map(({ title, color, to }, index) => (
          <Link
            to={to}
            key={index}
            className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow p-6 border border-${color}-100 hover:scale-[1.02] duration-200`}
          >
            <h2 className={`text-xl font-bold text-${color}-700 mb-2`}>
              {title}
            </h2>
            <p className="text-sm text-gray-600">Click to explore in detail.</p>
            <div className="mt-4">
              <button
                className={`bg-${color}-600 hover:bg-${color}-700 text-white font-medium py-2 px-4 rounded-lg transition-all`}
              >
                Explore
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CropMonitoring;
