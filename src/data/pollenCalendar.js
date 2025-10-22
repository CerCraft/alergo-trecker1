// src/data/pollenCalendar.js

const PLANT_NAMES = {
  birch: 'Берёза',
  grass: 'Злаки',
  weed: 'Сорняки (полынь)',
};

const POLLEN_CALENDAR = {
  moscow: {
    birch: { start: '2025-04-15', end: '2025-05-10', peak: '2025-04-28' },
    grass: { start: '2025-05-20', end: '2025-07-10', peak: '2025-06-15' },
    weed:  { start: '2025-07-15', end: '2025-08-30', peak: '2025-08-10' },
  },
  saintPetersburg: {
    birch: { start: '2025-04-25', end: '2025-05-20', peak: '2025-05-05' },
    grass: { start: '2025-06-01', end: '2025-07-20', peak: '2025-06-25' },
    weed:  { start: '2025-07-25', end: '2025-09-05', peak: '2025-08-15' },
  },
  ekaterinburg: {
    birch: { start: '2025-04-20', end: '2025-05-15', peak: '2025-05-01' },
    grass: { start: '2025-05-25', end: '2025-07-15', peak: '2025-06-20' },
    weed:  { start: '2025-07-20', end: '2025-09-01', peak: '2025-08-12' },
  },
};

const PLANT_COLORS = {
  birch: '#FF6B6B',
  grass: '#4ECDC4',
  weed:  '#6C5CE7',
};

const PLANT_ICONS = {
  birch: 'https://via.placeholder.com/50/92c952?text=🌳',
  grass: 'https://via.placeholder.com/50/78e08f?text=🌾',
  weed:  'https://via.placeholder.com/50/0a3d62?text=🌿',
};

export const getPlantName = (key) => PLANT_NAMES[key] || key;
export const getPlantColor = (key) => PLANT_COLORS[key] || '#999';
export const getPlantIcon = (key) => PLANT_ICONS[key] || 'https://via.placeholder.com/50?text=?';

export const getPollenLevel = (startDate, endDate, peakDate, currentDate) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const peak = new Date(peakDate).getTime();
  const now = new Date(currentDate).getTime();

  if (now < start || now > end) return 0;

  if (now <= peak) {
    const daysFromStart = (now - start) / (1000 * 60 * 60 * 24);
    const totalDaysToPeak = (peak - start) / (1000 * 60 * 60 * 24);
    return Math.min(100, Math.round((daysFromStart / totalDaysToPeak) * 80 + 20));
  } else {
    const daysFromPeak = (now - peak) / (1000 * 60 * 60 * 24);
    const totalDaysToEnd = (end - peak) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.round(100 - (daysFromPeak / totalDaysToEnd) * 80));
  }
};

export const generatePlantData = (cityKey, plantKey, days = 10) => {
  const cityData = POLLEN_CALENDAR[cityKey];
  if (!cityData || !cityData[plantKey]) return [];

  const plant = cityData[plantKey];
  const today = new Date();
  const data = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const level = getPollenLevel(plant.start, plant.end, plant.peak, dateStr);
    data.push({ date: dateStr, level });
  }

  return data;
};

export const getAllPlants = () => [
  { key: 'birch', name: 'Берёза' },
  { key: 'grass', name: 'Злаки' },
  { key: 'weed', name: 'Сорняки' },
];

export const getCities = () => [
  { key: 'moscow', name: 'Москва' },
  { key: 'saintPetersburg', name: 'Санкт-Петербург' },
  { key: 'ekaterinburg', name: 'Екатеринбург' },
];