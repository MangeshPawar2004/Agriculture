import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Typography, Box, Grid } from '@mui/material';

const COLORS = ['#2e7d32', '#43a047', '#66bb6a', '#81c784'];

const DataVisualization = ({ cropData, farmSize }) => {
  // Prepare data for yield comparison
  const yieldData = [
    {
      name: 'Minimum',
      yield: cropData.yieldPerAcre.min * farmSize,
    },
    {
      name: 'Average',
      yield: ((cropData.yieldPerAcre.min + cropData.yieldPerAcre.max) / 2) * farmSize,
    },
    {
      name: 'Maximum',
      yield: cropData.yieldPerAcre.max * farmSize,
    },
  ];

  // Prepare data for cost breakdown
  const costData = [
    {
      name: 'Harvesting Cost',
      value: cropData.harvestingCost * farmSize,
    },
    {
      name: 'Equipment Rental',
      value: cropData.recommendedTools.reduce((sum, tool) => sum + tool.rentalCost, 0),
    },
    {
      name: 'Labor Cost',
      value: cropData.harvestingCost * farmSize * 0.4, // Assuming 40% of harvesting cost is labor
    },
    {
      name: 'Storage Cost',
      value: cropData.harvestingCost * farmSize * 0.1, // Assuming 10% of harvesting cost is storage
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            p: 1,
            border: '1px solid #ccc',
            borderRadius: 1,
          }}
        >
          <Typography variant="subtitle2">{label}</Typography>
          <Typography variant="body2" color="primary">
            {payload[0].name}: {payload[0].value.toLocaleString()} {payload[0].name === 'yield' ? 'kg' : '₹'}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Harvest Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Expected Yield Range
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={yieldData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="yield"
                fill="#2e7d32"
                animationBegin={0}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Cost Breakdown
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
              >
                {costData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DataVisualization; 