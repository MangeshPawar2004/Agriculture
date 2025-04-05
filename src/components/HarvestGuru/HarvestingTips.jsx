import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimerIcon from '@mui/icons-material/Timer';

const HarvestingTips = ({ cropData }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          Harvesting Guide
        </Typography>

        {/* Seasonality Info */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<CalendarTodayIcon />}
            label={`Planting: ${cropData.seasonality.plantingMonth}`}
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<CalendarTodayIcon />}
            label={`Harvesting: ${cropData.seasonality.harvestingMonth}`}
            color="secondary"
            variant="outlined"
          />
          <Chip
            icon={<TimerIcon />}
            label={`Duration: ${cropData.seasonality.growthDuration}`}
            color="info"
            variant="outlined"
          />
        </Box>

        {/* Best Practices */}
        <Typography variant="subtitle1" color="primary" gutterBottom>
          Best Practices:
        </Typography>
        <List dense>
          {cropData.harvestingTips.map((tip, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary={tip}
                primaryTypographyProps={{ style: { fontWeight: index === 0 ? 'bold' : 'normal' } }}
              />
            </ListItem>
          ))}
        </List>

        {/* Ideal Conditions */}
        <Typography variant="subtitle1" color="primary" sx={{ mt: 2, mb: 1 }}>
          Ideal Harvesting Conditions:
        </Typography>
        <Box sx={{ 
          bgcolor: 'primary.light', 
          p: 2, 
          borderRadius: 1,
          color: 'white'
        }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            🌡️ Temperature: {cropData.idealConditions.temperature}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            💧 Humidity: {cropData.idealConditions.humidity}
          </Typography>
          <Typography variant="body2">
            💨 Wind Speed: {cropData.idealConditions.windSpeed}
          </Typography>
        </Box>

        {/* Quick Tips */}
        <Box sx={{ mt: 3, bgcolor: 'warning.light', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle2" color="white" gutterBottom>
            ⚠️ Important Reminders:
          </Typography>
          <Typography variant="body2" color="white">
            • Check equipment before starting
          </Typography>
          <Typography variant="body2" color="white">
            • Monitor weather forecast
          </Typography>
          <Typography variant="body2" color="white">
            • Ensure proper storage is ready
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HarvestingTips; 