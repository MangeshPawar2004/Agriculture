// App.jsx
import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
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
        <Route path="/services" element={<Services />} />
        <Route path="crop-monitoring/smart-tips" element={<SmartTipsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
