// components/CropForm.jsx
import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const initialState = {
  location: "",
  soilType: "",
  pH: "",
  nitrogen: "",
  phosphorus: "",
  potassium: "",
  rainfall: "",
};

export default function CropForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass to parent
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto"
    >
      <TextField
        name="location"
        label="Location"
        fullWidth
        onChange={handleChange}
      />
      <TextField
        name="soilType"
        label="Soil Type"
        fullWidth
        onChange={handleChange}
      />
      <TextField
        name="pH"
        label="Soil pH"
        type="number"
        fullWidth
        onChange={handleChange}
      />
      <TextField
        name="nitrogen"
        label="Nitrogen (N)"
        type="number"
        fullWidth
        onChange={handleChange}
      />
      <TextField
        name="phosphorus"
        label="Phosphorus (P)"
        type="number"
        fullWidth
        onChange={handleChange}
      />
      <TextField
        name="potassium"
        label="Potassium (K)"
        type="number"
        fullWidth
        onChange={handleChange}
      />
      <TextField
        name="rainfall"
        label="Rainfall (mm)"
        type="number"
        fullWidth
        onChange={handleChange}
      />
      <Button variant="contained" type="submit" fullWidth>
        Get Crop Suggestion
      </Button>
    </Box>
  );
}
x