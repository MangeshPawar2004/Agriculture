import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const YieldPrediction = ({ cropData, farmSize }) => {
  const calculateYield = () => {
    if (!cropData || !cropData.yieldPerAcre) return 0;
    return (cropData.yieldPerAcre * farmSize).toFixed(2);
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          Yield Prediction
        </Typography>
        <Typography variant="h3">
          {calculateYield()} tons
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Expected yield based on your farm size and crop type
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Harvesting Month: {cropData.seasonality.harvestingMonth}
        </Typography>
        <Typography variant="body2">
          Growth Duration: {cropData.seasonality.growthDuration}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default YieldPrediction; 