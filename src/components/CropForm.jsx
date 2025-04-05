// components/CropForm.jsx
import { useState } from "react";
import { TextField, Button, Box, Grid, Typography, Paper } from "@mui/material";

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
    <Paper elevation={3} className="p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <Typography variant="h5" className="text-center mb-4">
        Crop Suggestion Form
      </Typography>
      <Box component="form" onSubmit={handleSubmit} className="space-y-4">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="location"
              label="Location"
              fullWidth
              onChange={handleChange}
              variant="outlined"
              className="bg-white"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="soilType"
              label="Soil Type"
              fullWidth
              onChange={handleChange}
              variant="outlined"
              className="bg-white"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="pH"
              label="Soil pH"
              type="number"
              fullWidth
              onChange={handleChange}
              variant="outlined"
              className="bg-white"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="nitrogen"
              label="Nitrogen (N)"
              type="number"
              fullWidth
              onChange={handleChange}
              variant="outlined"
              className="bg-white"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="phosphorus"
              label="Phosphorus (P)"
              type="number"
              fullWidth
              onChange={handleChange}
              variant="outlined"
              className="bg-white"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="potassium"
              label="Potassium (K)"
              type="number"
              fullWidth
              onChange={handleChange}
              variant="outlined"
              className="bg-white"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="rainfall"
              label="Rainfall (mm)"
              type="number"
              fullWidth
              onChange={handleChange}
              variant="outlined"
              className="bg-white"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Get Crop Suggestion
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
