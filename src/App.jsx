// App.jsx
import { Routes, Route } from "react-router-dom";
import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

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
import HarvestingPage from "./components/HarvestingPage";
import SmartSell from "./pages/SmartSell";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32", // Green color for agricultural theme
    },
    secondary: {
      main: "#43a047",
    },
  },
  typography: {
    h3: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* This normalizes the styles */}
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
                  <p className="mb-6 text-gray-600">
                    Please sign in to continue
                  </p>
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
          <Route path="/smart-sell" element={<SmartSell />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route
            path="crop-monitoring/smart-tips"
            element={<SmartTipsPage />}
          />

          <Route path="/hardvest-dashboard" element={<HarvestingPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
