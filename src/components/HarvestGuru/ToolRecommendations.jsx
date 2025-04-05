import React from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';

const ToolRecommendations = ({ cropData }) => {
  if (!cropData || !cropData.recommendedTools) return null;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          Recommended Tools
        </Typography>
        <Box sx={{ mb: 2 }}>
          {cropData.recommendedTools.map((tool, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                • {tool.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tool.description}
              </Typography>
              <Typography variant="body2" color="primary">
                Rental Cost: ₹{tool.rentalCost.toLocaleString()}
              </Typography>
              {index < cropData.recommendedTools.length - 1 && (
                <Divider sx={{ my: 1 }} />
              )}
            </Box>
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary">
          Suggested equipment for efficient harvesting
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ToolRecommendations; 