// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CropSuggest from "./pages/CropSuggest";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/crop-suggest" element={<CropSuggest />} />
    </Routes>
  );
}

export default App;
