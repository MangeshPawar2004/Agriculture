// Crop yield data (tons per acre)
const cropYieldData = {
  wheat: {
    yield: 0.5,
    costPerAcre: 1000,
    tools: {
      equipment: ['Combine Harvester', 'Grain Cart', 'Truck'],
      storage: 'Dry, ventilated silo or warehouse',
      speedTips: [
        'Use mechanized tools during peak dry hours',
        'Ensure equipment is well-maintained before harvest',
        'Plan your harvesting pattern to minimize turning time'
      ]
    }
  },
  rice: {
    yield: 0.8,
    costPerAcre: 1200,
    tools: {
      equipment: ['Rice Harvester', 'Sickle', 'Thresher'],
      storage: 'Cool, moisture-free warehouse',
      speedTips: [
        'Harvest in early morning to minimize grain losses',
        'Use proper drainage before harvesting',
        'Coordinate with labor team for efficient collection'
      ]
    }
  },
  corn: {
    yield: 0.6,
    costPerAcre: 800,
    tools: {
      equipment: ['Corn Harvester', 'Grain Cart', 'Moisture Meter'],
      storage: 'Well-ventilated silo with temperature control',
      speedTips: [
        'Monitor grain moisture content regularly',
        'Use proper combine settings for minimal damage',
        'Plan harvest when moisture content is optimal'
      ]
    }
  },
  soybeans: {
    yield: 0.4,
    costPerAcre: 900,
    tools: {
      equipment: ['Combine Harvester', 'Flex Header', 'Grain Cart'],
      storage: 'Clean, dry storage with good ventilation',
      speedTips: [
        'Wait for proper pod maturity',
        'Harvest when moisture content is 13-15%',
        'Adjust combine settings for minimal pod shattering'
      ]
    }
  }
};

export const calculateYield = (cropType, farmSize) => {
  const crop = cropYieldData[cropType];
  if (!crop) return 0;
  return crop.yield * farmSize;
};

export const calculateHarvestingCost = (cropType, farmSize) => {
  const crop = cropYieldData[cropType];
  if (!crop) return 0;
  return crop.costPerAcre * farmSize;
};

export const getToolRecommendations = (cropType) => {
  const crop = cropYieldData[cropType];
  if (!crop) return null;
  return crop.tools;
};

export const getSpeedupTips = (cropType) => {
  const crop = cropYieldData[cropType];
  if (!crop) return [];
  return crop.tools.speedTips;
};

export const analyzeCropReadiness = (weatherData, cropType) => {
  const willRainSoon = weatherData.willRainSoon;
  
  if (willRainSoon) {
    return {
      status: 'warning',
      message: '⚠️ Consider early harvest - Rain expected in the next 3 days',
      recommendation: 'Schedule harvest as soon as possible to avoid weather damage'
    };
  }

  return {
    status: 'success',
    message: '✅ Safe to harvest - Good weather expected',
    recommendation: 'Proceed with normal harvest schedule'
  };
};

export default {
  calculateYield,
  calculateHarvestingCost,
  getToolRecommendations,
  getSpeedupTips,
  analyzeCropReadiness
}; 