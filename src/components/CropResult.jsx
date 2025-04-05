import React from "react";
import PropTypes from "prop-types";

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
  if (!data) {
    return (
      <div className="mt-6 p-4 bg-blue-100 text-blue-800 rounded animate-pulse">
        Loading recommendation...
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="mt-6 p-4 bg-red-100 text-red-800 rounded">
        Error: {data.error}
      </div>
    );
  }

  if (!data.crop || !data.sowing_season) {
    return (
      <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded">
        Incomplete recommendation data received.
      </div>
    );
  }

  const DataSection = ({ title, children }) => (
    <div className="p-4 bg-green-50 rounded-lg border border-green-200 shadow-sm">
      <h3 className="font-semibold text-base text-green-800 mb-1">{title}</h3>
      <p className="text-gray-700 text-sm">
        {children && typeof children === "string" && children.trim()
          ? children
          : "Data not available."}
      </p>
    </div>
  );

  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200 space-y-5 animate-fade-in">
      <h2 className="text-2xl font-bold text-green-700 border-b border-green-300 pb-2 mb-5">
        Crop Recommendation Report
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DataSection title="Recommended Crop">{data.crop}</DataSection>
        <DataSection title="Sowing Season">{data.sowing_season}</DataSection>
        <DataSection title="Estimated Duration">{data.duration}</DataSection>
        <DataSection title="Climate Suitability">{data.climate}</DataSection>
        <DataSection title="Irrigation Needs">
          {data.irrigation_needs}
        </DataSection>
        <DataSection title="Fertilizer Recommendations">
          {data.fertilizer_recommendations}
        </DataSection>
      </div>

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

      {/* Try Again Button */}
      <div className="text-center">
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

CropReport.propTypes = {
  data: PropTypes.shape({
    crop: PropTypes.string,
    sowing_season: PropTypes.string,
    duration: PropTypes.string,
    care_tips: PropTypes.arrayOf(PropTypes.string),
    climate: PropTypes.string,
    irrigation_needs: PropTypes.string,
    fertilizer_recommendations: PropTypes.string,
    error: PropTypes.string,
  }).isRequired,
};

export default CropReport;
