// App.jsx
import { Routes, Route } from "react-router-dom";
import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import CropSuggest from "./pages/CropSuggest";
import CropMonitoring from "./pages/CropMonitoring";
import BestPracticesPage from "./pages/BestPracticesPage";
import WeatherForecastPage from "./pages/WeatherForecastPage";
import ResourceOptimizerPage from "./pages/ResourceOptimizerPage";
import CropHealthCheckPage from "./pages/CropHealthCheckPage";
import SmartTipsPage from "./pages/SmartTipsPage";
import Services from "./pages/Services";
import AboutUsPage from "./pages/About";
import Auth from "./components/Auth";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <SignedIn>
              <div className="p-6">
                <UserButton afterSignOutUrl="/" />
                <h1 className="text-2xl font-semibold mt-4">
                  Welcome to your dashboard!
                </h1>
              </div>
            </SignedIn>
          }
        />

        <Route
          path="/"
          element={
            <SignedOut>
              <div className="p-6 text-center">
                <h1 className="text-3xl font-bold mb-4">
                  Welcome to BeejSeBazaar!
                </h1>
                <p className="mb-6 text-gray-600">Please sign in to continue</p>
                <a
                  href="/sign-in"
                  className="bg-[#fca311] hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
                >
                  Sign In
                </a>
              </div>
            </SignedOut>
          }
        />

        {/* Main Pages */}
        <Route index element={<Home />} />
        <Route path="crop-suggest" element={<CropSuggest />} />
        <Route path="crop-monitoring" element={<CropMonitoring />} />

        {/* Subpages of Crop Monitoring */}
        <Route
          path="crop-monitoring/best-practices"
          element={<BestPracticesPage />}
        />
        <Route
          path="crop-monitoring/weather-forecast"
          element={<WeatherForecastPage />}
        />
        <Route
          path="crop-monitoring/resource-optimizer"
          element={<ResourceOptimizerPage />}
        />
        <Route
          path="crop-monitoring/crop-health-check"
          element={<CropHealthCheckPage />}
        />
        <Route path="/login" element={<Auth />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="crop-monitoring/smart-tips" element={<SmartTipsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
