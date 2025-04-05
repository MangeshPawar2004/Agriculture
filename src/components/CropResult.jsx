import React from "react";
import PropTypes from "prop-types";

/**
 * Displays a detailed crop recommendation report.
 * @param {object} props - The component props.
 * @param {object} props.data - The crop recommendation data object.
 */
const CropReport = ({ data }) => {
  if (!data) {
    return (
      <div className="mt-6 p-4 bg-green-50 text-black rounded-lg animate-pulse shadow-inner">
        Loading recommendation...
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="mt-6 p-4 bg-red-100 text-black border border-red-300 rounded-lg shadow-sm">
        Error: {data.error}
      </div>
    );
  }

  if (!data.crop || !data.sowing_season) {
    return (
      <div className="mt-6 p-4 bg-yellow-100 text-black border border-yellow-300 rounded-lg shadow-sm">
        Incomplete recommendation data received.
      </div>
    );
  }

  const DataSection = ({ title, children }) => (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow hover:shadow-lg transition-transform duration-200 hover:scale-[1.02]">
      <h3 className="font-semibold text-sm text-black mb-1 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-black text-sm leading-relaxed">
        {children && typeof children === "string" && children.trim()
          ? children
          : "Data not available."}
      </p>
    </div>
  );

  return (
    <div className="mt-10 px-6 py-8 bg-gray-50 rounded-2xl shadow-xl border border-gray-200 space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-black border-b border-green-300 pb-3">
        🌱 Crop Recommendation Report
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

      {data.care_tips?.length > 0 && (
        <div>
          <h3 className="font-semibold text-xl text-black mb-3 pl-1">
            🌾 Care Tips
          </h3>
          <div className="p-4 bg-white rounded-lg border border-lime-200 shadow-inner">
            <ul className="list-disc pl-5 space-y-2 text-black text-sm">
              {data.care_tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="text-center pt-4">
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-green-600 border-black text-sm font-medium rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          🔄 Try Again
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
