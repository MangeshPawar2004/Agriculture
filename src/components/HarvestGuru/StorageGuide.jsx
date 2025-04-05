import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';

const StorageGuide = ({ cropData }) => {
  if (!cropData || !cropData.storageType) return null;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          Storage Guide
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
          {cropData.storageType.facility}
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
          Requirements:
        </Typography>
        <List dense>
          {cropData.storageType.requirements.map((req, index) => (
            <ListItem key={index}>
              <ListItemText primary={req} />
            </ListItem>
          ))}
        </List>

        <Typography variant="body2" sx={{ mt: 2, color: 'primary.main' }}>
          Storage Duration: {cropData.storageType.duration}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Recommended storage conditions for optimal crop preservation
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StorageGuide; 