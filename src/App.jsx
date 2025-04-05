// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CropSuggest from "./pages/CropSuggest";
import CropMonitoring from "./pages/CropMonitoring";
import BestPracticesPage from "./pages/BestPracticesPage";
import WeatherForecastPage from "./pages/WeatherForecastPage";
import ResourceOptimizerPage from "./pages/ResourceOptimizerPage";
import CropHealthCheckPage from "./pages/CropHealthCheckPage";
import SmartTipsPage from "./pages/SmartTipsPage";

function App() {
  return (
    <Routes>
      {/* Main Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/crop-suggest" element={<CropSuggest />} />
      <Route path="/crop-monitoring" element={<CropMonitoring />} />

      {/* Subpages of Crop Monitoring */}
      <Route
        path="/crop-monitoring/best-practices"
        element={<BestPracticesPage />}
      />
      <Route
        path="/crop-monitoring/weather-forecast"
        element={<WeatherForecastPage />}
      />
      <Route
        path="/crop-monitoring/resource-optimizer"
        element={<ResourceOptimizerPage />}
      />
      <Route
        path="/crop-monitoring/crop-health-check"
        element={<CropHealthCheckPage />}
      />
      <Route path="/crop-monitoring/smart-tips" element={<SmartTipsPage />} />
    </Routes>
  );
}

export default App;
