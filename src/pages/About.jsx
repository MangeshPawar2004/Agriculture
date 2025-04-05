import React from "react";

const AboutUsPage = () => {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#fca311] to-[#14213d] rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
              <img
                src="/public/images/about.avif"
                alt="Farmers working in field"
                className="relative rounded-3xl shadow-xl object-cover w-full h-full max-h-[500px] transform group-hover:scale-[1.02] transition duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent rounded-b-3xl p-6">
                <p className="text-white text-sm font-medium">
                  Empowering Farmers Through Technology
                </p>
              </div>
            </div>

            {/* Right: About Info */}
            <div className="space-y-6">
              <div className="inline-block">
                <h2 className="text-4xl font-bold text-[#14213d] mb-2">
                  About <span className="text-[#fca311]">BeejSeBazaar</span>
                </h2>
                <div className="h-1 w-20 bg-[#fca311] rounded-full"></div>
              </div>

              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  BeejSeBazaar is on a mission to revolutionize Indian
                  agriculture by integrating AI and data-driven solutions into
                  the heart of farming. Our platform empowers farmers with
                  personalized crop recommendations, weather-based alerts,
                  disease diagnosis tools, and direct access to fair
                  marketplaces — all in one place.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We believe that technology should serve even the smallest
                  farmers, helping them make informed decisions, boost
                  productivity, and ensure profitability. With BeejSeBazaar, we
                  bridge the gap between traditional wisdom and smart
                  innovation.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <button className="bg-[#fca311] hover:bg-[#e69500] text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Join the Revolution
                </button>
                <button className="border-2 border-[#14213d] text-[#14213d] hover:bg-[#14213d] hover:text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
                  Learn More
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#fca311]/10 p-2 rounded-lg">
                      <svg
                        className="w-6 h-6 text-[#fca311]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#14213d]">
                        Data-Driven
                      </h3>
                      <p className="text-sm text-gray-600">
                        AI-powered insights
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#fca311]/10 p-2 rounded-lg">
                      <svg
                        className="w-6 h-6 text-[#fca311]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#14213d]">
                        Fast Results
                      </h3>
                      <p className="text-sm text-gray-600">
                        Quick implementation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsPage;
