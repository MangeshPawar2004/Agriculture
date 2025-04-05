import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Paper,
  Divider 
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Mock data for development
const MOCK_YIELD_DATA = {
  wheat: 0.5,  // tons per acre
  rice: 0.8,
  corn: 0.6,
  soybeans: 0.4
};

const MOCK_TOOLS_DATA = {
  wheat: {
    tools: "Combine Harvester, Grain Cart",
    storage: "Dry, ventilated silo or warehouse",
    speedTip: "Use mechanized tools and harvest during peak dry hours"
  },
  rice: {
    tools: "Rice Harvester, Sickle",
    storage: "Cool, moisture-free warehouse",
    speedTip: "Harvest in early morning to minimize grain losses"
  }
};

const MOCK_COST_DATA = {
  wheat: 1000,  // cost per acre
  rice: 1200,
  corn: 800,
  soybeans: 900
};

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
  },
}));

const HarvestingModule = ({ farmData }) => {
  const [yieldEstimate, setYieldEstimate] = useState(0);
  const [harvestTiming, setHarvestTiming] = useState('');
  const [recommendations, setRecommendations] = useState({});
  const [costEstimate, setCostEstimate] = useState(0);

  useEffect(() => {
    // Calculate yield estimate
    const calculateYield = () => {
      const yieldPerAcre = MOCK_YIELD_DATA[farmData.cropType] || 0;
      return farmData.farmSize * yieldPerAcre;
    };

    // Get harvest timing (mock weather check)
    const checkHarvestTiming = () => {
      // In reality, this would call the OpenWeatherMap API
      const mockWeather = Math.random() > 0.5;
      return mockWeather 
        ? "✅ Safe to harvest - Good weather expected"
        : "⚠️ Consider early harvest - Rain expected in 3 days";
    };

    // Get recommendations
    const getRecommendations = () => {
      return MOCK_TOOLS_DATA[farmData.cropType] || {};
    };

    // Calculate cost
    const calculateCost = () => {
      const costPerAcre = MOCK_COST_DATA[farmData.cropType] || 0;
      return farmData.farmSize * costPerAcre;
    };

    setYieldEstimate(calculateYield());
    setHarvestTiming(checkHarvestTiming());
    setRecommendations(getRecommendations());
    setCostEstimate(calculateCost());
  }, [farmData]);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
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
          Harvest Guru Dashboard
        </Typography>
        <Typography variant="subtitle1">
          Your intelligent harvesting assistant
        </Typography>
      </Paper>
      
      <Grid container spacing={3}>
        {/* Yield Prediction */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" color="primary">
                Yield Prediction
              </Typography>
              <Typography variant="h4">
                {yieldEstimate.toFixed(2)} tons
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Expected yield based on your farm size and crop type
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Harvest Timing */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" color="primary">
                Harvest Timing
              </Typography>
              <Typography variant="h6">
                {harvestTiming}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Tools & Storage */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" color="primary">
                Tools & Storage
              </Typography>
              <Typography variant="subtitle1">
                <strong>Recommended Tools:</strong> {recommendations.tools}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1">
                <strong>Storage:</strong> {recommendations.storage}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Cost Estimation */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" color="primary">
                Cost Estimation
              </Typography>
              <Typography variant="h4">
                ₹{costEstimate.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Estimated harvesting cost for your farm
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Speed-Up Tips */}
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" color="primary">
                Speed-Up Tips
              </Typography>
              <Typography variant="body1">
                {recommendations.speedTip}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HarvestingModule; 