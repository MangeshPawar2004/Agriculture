import React from "react";

/**
 * Displays a detailed crop recommendation report.
 * @param {object} props - The component props.
 * @param {object} props.data - The crop recommendation data object.
 * @param {string} props.data.crop - Recommended crop name.
 * @param {string} props.data.sowing_season - Optimal sowing season.
 * @param {string} props.data.duration - Crop duration until harvest.
 * @param {string[]} props.data.care_tips - Array of care tips.
 * @param {string} props.data.climate - Suitable climate.
 * @param {string} props.data.irrigation_needs - Water requirements.
 * @param {string} props.data.fertilizer_recommendations - Fertilizer guidance.
 * @param {string} [props.data.error] - Optional error message.
 */
const CropReport = ({ data }) => {
  // Basic validation or loading state
  if (!data) {
    return (
      <div className="mt-6 p-4 bg-blue-100 text-blue-800 rounded animate-pulse">
        Loading recommendation...
      </div>
    );
  }

  // Handle potential errors passed in the data object
  if (data.error) {
    return (
      <div className="mt-6 p-4 bg-red-100 text-red-800 rounded">
        Error: {data.error}
      </div>
    );
  }

  // Check if essential data is present
  if (!data.crop || !data.sowing_season) {
    return (
      <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded">
        Incomplete recommendation data received.
      </div>
    );
  }

  // Helper component for consistent data display sections
  const DataSection = ({ title, children }) => (
    <div className="p-4 bg-green-50 rounded-lg border border-green-200 shadow-sm">
      <h3 className="font-semibold text-base text-green-800 mb-1">{title}</h3>
      <p className="text-gray-700 text-sm">{children}</p>
    </div>
  );

  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200 space-y-5">
      <h2 className="text-2xl font-bold text-green-700 border-b border-green-300 pb-2 mb-5">
        Crop Recommendation Report
      </h2>

      {/* Grid layout for key details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DataSection title="Recommended Crop">{data.crop}</DataSection>

        <DataSection title="Sowing Season">{data.sowing_season}</DataSection>

        <DataSection title="Estimated Duration">{data.duration}</DataSection>

        <DataSection title="Climate Suitability">{data.climate}</DataSection>

        {/* Span across two columns on larger screens if needed, or keep as single */}
        <DataSection title="Irrigation Needs">
          {data.irrigation_needs}
        </DataSection>

        <DataSection title="Fertilizer Recommendations">
          {data.fertilizer_recommendations}
        </DataSection>
      </div>

      {/* Care Tips Section */}
      {data.care_tips && data.care_tips.length > 0 && (
        <div className="pt-4">
          <h3 className="font-semibold text-lg text-green-800 mb-2 pl-1">
            Care Tips
          </h3>
          <div className="p-4 bg-lime-50 rounded-lg border border-lime-200 shadow-sm">
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-800">
              {data.care_tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropReport;
