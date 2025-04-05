import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Box,
  Button,
  Paper,
  Zoom,
  Fade,
} from '@mui/material';
import { cropData } from '../../data/cropData';
import YieldPrediction from './YieldPrediction';
import ToolRecommendations from './ToolRecommendations';
import StorageGuide from './StorageGuide';
import HarvestingTips from './HarvestingTips';
import Navbar from './Navbar';
import Footer from './Footer';

const HarvestingPage = () => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [showTips, setShowTips] = useState(false);

  const handleCropChange = (event) => {
    setSelectedCrop(event.target.value);
  };

  const handleFarmSizeChange = (event) => {
    const value = event.target.value;
    if (value === '' || (!isNaN(value) && value >= 0)) {
      setFarmSize(value);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Paper 
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #2e7d32 30%, #43a047 90%)',
            color: 'white'
          }}
        >
          <Typography variant="h3" gutterBottom>
            HarvestGuru
          </Typography>
          <Typography variant="subtitle1">
            Your intelligent harvesting assistant
          </Typography>
        </Paper>

        {/* Farm Details Selection */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Crop Type"
                value={selectedCrop}
                onChange={handleCropChange}
                helperText="Enter crop name"
              >
                {Object.entries(cropData).map(([key, crop]) => (
                  <MenuItem key={key} value={key}>{crop.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Farm Size (Acres)"
                type="text"
                value={farmSize}
                onChange={handleFarmSizeChange}
                helperText="Enter your farm size in acres"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Main Dashboard Content */}
        {selectedCrop && farmSize ? (
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                {/* Yield Prediction */}
                <Grid item xs={12} md={6}>
                  <YieldPrediction 
                    cropData={cropData[selectedCrop]} 
                    farmSize={parseFloat(farmSize) || 0} 
                  />
                </Grid>

                {/* Cost Estimation */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ height: '100%' }}>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        Cost Estimation
                      </Typography>
                      <Typography variant="h3">
                        ₹{((cropData[selectedCrop].harvestingCost * (parseFloat(farmSize) || 0)) + 
                          cropData[selectedCrop].recommendedTools.reduce((sum, tool) => sum + tool.rentalCost, 0)).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total cost including equipment rental
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                {/* Harvesting Tips (Conditional Render) */}
                {showTips && (
                  <Grid item xs={12}>
                    <HarvestingTips cropData={cropData[selectedCrop]} />
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={4}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <ToolRecommendations cropData={cropData[selectedCrop]} />
                </Grid>
                <Grid item xs={12}>
                  <StorageGuide cropData={cropData[selectedCrop]} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Please select a crop and enter your farm size to view detailed information
            </Typography>
          </Paper>
        )}

        {/* Action Buttons */}
        {selectedCrop && farmSize && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              sx={{ mr: 2 }}
              onClick={() => setShowTips(!showTips)}
            >
              {showTips ? 'Hide Harvesting Tips' : 'View Harvesting Tips'}
            </Button>
          </Box>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default HarvestingPage; 