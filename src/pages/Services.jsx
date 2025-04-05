import React from "react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "SowSmart (Crop Recommendation)",
    description:
      "Get AI-powered crop suggestions based on your soil and location.",
    path: "/crop-suggest",
    icon: "🌱",
  },
  {
    title: "FasalWatch (Crop Monitoring)",
    description:
      "Upload crop images to detect diseases with real-time diagnosis.",
    path: "/crop-monitoring",
    icon: "👁️",
  },
  {
    title: "HarvestGuru ",
    description:
      "Know the best market and timing to sell your produce profitably.",
    path: "/market-forecast",
    icon: "💰",
  },
  {
    title: "FasalBazaar",
    description:
      "Optimize your resources with personalized insights and weather alerts.",
    path: "/smart-resources",
    icon: "📊",
  },
];

const Services = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#f9f9f9] to-white py-20 px-4 sm:px-8 md:px-16">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
          Our Smart Services
        </h2>
        <p className="text-gray-600 text-lg animate-fade-in-delay">
          Empowering farmers with technology-driven decisions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <Link to={service.path} key={index} className="group">
            <div className="h-full p-10 bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:border-green-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full transform translate-x-1/2 -translate-y-1/2 transition-all duration-500 group-hover:scale-150 group-hover:bg-green-100"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-6 flex items-center text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="mr-2">Learn more</span>
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Services;
