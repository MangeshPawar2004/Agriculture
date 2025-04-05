export const cropData = {
  wheat: {
    name: 'Wheat',
    yieldPerAcre: 0.5,
    harvestingCost: 1000,
    recommendedTools: [
      {
        name: 'Combine Harvester',
        description: 'For efficient large-scale harvesting',
        rentalCost: 5000
      },
      {
        name: 'Grain Cart',
        description: 'For collecting and transporting harvested wheat',
        rentalCost: 2000
      }
    ],
    storageType: {
      facility: 'Dry, ventilated silo',
      requirements: [
        'Temperature: 15-20°C',
        'Humidity: 12-14%',
        'Ventilation: Good airflow'
      ],
      duration: 'Up to 6 months'
    },
    harvestingTips: [
      'Best harvested when grain moisture content is below 14%',
      'Early morning harvesting recommended',
      'Check weather forecast before starting'
    ],
    idealConditions: {
      temperature: '20-25°C',
      humidity: '50-60%',
      windSpeed: 'Less than 20 km/h'
    },
    seasonality: {
      plantingMonth: 'November',
      harvestingMonth: 'April',
      growthDuration: '140-160 days'
    }
  },
  rice: {
    name: 'Rice',
    yieldPerAcre: 0.8,
    harvestingCost: 1200,
    recommendedTools: [
      {
        name: 'Rice Harvester',
        description: 'For mechanical harvesting of rice',
        rentalCost: 6000
      },
      {
        name: 'Sickle',
        description: 'For manual harvesting in smaller areas',
        rentalCost: 100
      },
      {
        name: 'Thresher',
        description: 'For separating grains from stalks',
        rentalCost: 3000
      }
    ],
    storageType: {
      facility: 'Cool, moisture-free warehouse',
      requirements: [
        'Temperature: 10-15°C',
        'Humidity: 10-12%',
        'Protection from pests'
      ],
      duration: 'Up to 12 months'
    },
    harvestingTips: [
      'Harvest when 80-85% of grains are straw-colored',
      'Drain the field 7-10 days before harvesting',
      'Avoid harvesting in rain'
    ],
    idealConditions: {
      temperature: '25-30°C',
      humidity: '60-80%',
      windSpeed: 'Less than 15 km/h'
    },
    seasonality: {
      plantingMonth: 'June',
      harvestingMonth: 'November',
      growthDuration: '120-140 days'
    }
  },
  corn: {
    name: 'Corn',
    yieldPerAcre: 0.6,
    harvestingCost: 800,
    recommendedTools: [
      {
        name: 'Corn Harvester',
        description: 'For efficient corn harvesting',
        rentalCost: 5500
      },
      {
        name: 'Moisture Meter',
        description: 'For checking grain moisture content',
        rentalCost: 500
      }
    ],
    storageType: {
      facility: 'Well-ventilated silo with temperature control',
      requirements: [
        'Temperature: 10-15°C',
        'Humidity: 13-15%',
        'Regular monitoring'
      ],
      duration: 'Up to 8 months'
    },
    harvestingTips: [
      'Harvest when kernels show black layer formation',
      'Monitor moisture content regularly',
      'Start with driest fields first'
    ],
    idealConditions: {
      temperature: '20-25°C',
      humidity: '50-70%',
      windSpeed: 'Less than 25 km/h'
    },
    seasonality: {
      plantingMonth: 'March',
      harvestingMonth: 'August',
      growthDuration: '100-120 days'
    }
  },
  soybean: {
    name: 'Soybean',
    yieldPerAcre: 0.4,
    harvestingCost: 900,
    recommendedTools: [
      {
        name: 'Combine Harvester',
        description: 'For efficient soybean harvesting',
        rentalCost: 5000
      },
      {
        name: 'Reel',
        description: 'For gathering and cutting soybean plants',
        rentalCost: 1500
      }
    ],
    storageType: {
      facility: 'Clean, dry storage bins',
      requirements: [
        'Temperature: 12-18°C',
        'Humidity: 11-13%',
        'Good aeration'
      ],
      duration: 'Up to 10 months'
    },
    harvestingTips: [
      'Harvest when pods are brown and dry',
      'Moisture content should be below 13%',
      'Avoid harvesting during wet conditions'
    ],
    idealConditions: {
      temperature: '22-28°C',
      humidity: '45-65%',
      windSpeed: 'Less than 20 km/h'
    },
    seasonality: {
      plantingMonth: 'June',
      harvestingMonth: 'October',
      growthDuration: '90-120 days'
    }
  },
  cotton: {
    name: 'Cotton',
    yieldPerAcre: 0.3,
    harvestingCost: 1500,
    recommendedTools: [
      {
        name: 'Cotton Picker',
        description: 'For mechanical cotton harvesting',
        rentalCost: 7000
      },
      {
        name: 'Module Builder',
        description: 'For compressing harvested cotton',
        rentalCost: 3000
      }
    ],
    storageType: {
      facility: 'Dry, covered storage area',
      requirements: [
        'Temperature: 15-20°C',
        'Humidity: 45-50%',
        'Protection from contamination'
      ],
      duration: 'Up to 12 months'
    },
    harvestingTips: [
      'Harvest when 60% or more bolls are open',
      'Avoid harvesting wet cotton',
      'Remove debris before storage'
    ],
    idealConditions: {
      temperature: '25-30°C',
      humidity: '40-60%',
      windSpeed: 'Less than 15 km/h'
    },
    seasonality: {
      plantingMonth: 'April',
      harvestingMonth: 'October',
      growthDuration: '150-180 days'
    }
  },
  sugarcane: {
    name: 'Sugarcane',
    yieldPerAcre: 2.5,
    harvestingCost: 2000,
    recommendedTools: [
      {
        name: 'Sugarcane Harvester',
        description: 'For mechanical cane cutting',
        rentalCost: 8000
      },
      {
        name: 'Cane Loader',
        description: 'For loading cut cane onto transport',
        rentalCost: 4000
      }
    ],
    storageType: {
      facility: 'Processing within 24 hours',
      requirements: [
        'Immediate transport to mill',
        'Keep cane fresh and clean',
        'Avoid prolonged storage'
      ],
      duration: 'Process within 24 hours'
    },
    harvestingTips: [
      'Cut at ground level',
      'Remove dry leaves before cutting',
      'Transport to mill quickly'
    ],
    idealConditions: {
      temperature: '28-32°C',
      humidity: '60-80%',
      windSpeed: 'Less than 25 km/h'
    },
    seasonality: {
      plantingMonth: 'March',
      harvestingMonth: 'January',
      growthDuration: '300-360 days'
    }
  }
}; 