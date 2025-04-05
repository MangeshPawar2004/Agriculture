import React from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const HarvestingPage = () => {
  const [selectedCrop, setSelectedCrop] = React.useState("wheat");
  const [farmSize, setFarmSize] = React.useState(4);

  // Mock data
  const crops = {
    wheat: {
      yieldPerAcre: 0.5,
      harvestingCost: 1000,
      recommendedTools: ["Combine Harvester", "Grain Cart"],
      storageType: "Dry, ventilated silo",
    },
    rice: {
      yieldPerAcre: 0.8,
      harvestingCost: 1200,
      recommendedTools: ["Rice Harvester", "Sickle"],
      storageType: "Cool, moisture-free warehouse",
    },
    corn: {
      yieldPerAcre: 0.6,
      harvestingCost: 800,
      recommendedTools: ["Corn Harvester", "Moisture Meter"],
      storageType: "Well-ventilated silo",
    },
  };

  const calculateYield = () => {
    return (crops[selectedCrop].yieldPerAcre * farmSize).toFixed(2);
  };

  const calculateCost = () => {
    return (crops[selectedCrop].harvestingCost * farmSize).toLocaleString();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" gutterBottom align="center" color="primary">
        HarvestGuru
      </Typography>

      {/* Farm Details Selection */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Crop Type</InputLabel>
              <Select
                value={selectedCrop}
                label="Crop Type"
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                <MenuItem value="wheat">Wheat</MenuItem>
                <MenuItem value="rice">Rice</MenuItem>
                <MenuItem value="corn">Corn</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Farm Size (Acres)</InputLabel>
              <Select
                value={farmSize}
                label="Farm Size (Acres)"
                onChange={(e) => setFarmSize(e.target.value)}
              >
                {[1, 2, 3, 4, 5, 10, 15, 20].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size} Acres
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Main Dashboard Content */}
      <Grid container spacing={3}>
        {/* Yield Prediction */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Yield Prediction
              </Typography>
              <Typography variant="h3">{calculateYield()} tons</Typography>
              <Typography variant="body2" color="text.secondary">
                Expected yield based on your farm size and crop type
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Cost Estimation */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Cost Estimation
              </Typography>
              <Typography variant="h3">₹{calculateCost()}</Typography>
              <Typography variant="body2" color="text.secondary">
                Estimated harvesting cost
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tools & Equipment */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Recommended Tools
              </Typography>
              <Box sx={{ mb: 2 }}>
                {crops[selectedCrop].recommendedTools.map((tool, index) => (
                  <Typography key={index} variant="body1">
                    • {tool}
                  </Typography>
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Suggested equipment for efficient harvesting
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Storage */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Storage Recommendation
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {crops[selectedCrop].storageType}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recommended storage conditions for your crop
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Weather Alert */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: "success.light" }}>
            <CardContent>
              <Typography variant="h6" color="white" gutterBottom>
                Harvest Timing
              </Typography>
              <Typography variant="body1" color="white">
                ✅ Weather conditions are favorable for harvesting in the next 3
                days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Button */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          size="large"
          onClick={() =>
            alert("This will be connected to the detailed planning module")
          }
        >
          Plan Harvest Schedule
        </Button>
      </Box>
    </Container>
  );
};

export default HarvestingPage;
