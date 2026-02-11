// Unit conversion utilities for physics problems

const UNIT_CONVERSIONS = {
  // Velocity conversions to m/s
  'km/h': 0.277778,
  'kmph': 0.277778,
  'km/hr': 0.277778,
  'mph': 0.44704,
  'ft/s': 0.3048,
  'cm/s': 0.01,
  'm/s': 1,
  'mps': 1,

  // Distance conversions to meters
  'km': 1000,
  'cm': 0.01,
  'mm': 0.001,
  'ft': 0.3048,
  'inch': 0.0254,
  'in': 0.0254,
  'm': 1,
};

/**
 * Convert velocity to m/s
 * @param {number} value - The velocity value
 * @param {string} unit - The unit (e.g., 'km/h', 'm/s')
 * @returns {number} - Velocity in m/s
 */
export const convertVelocity = (value, unit) => {
  if (!unit || unit === 'm/s' || unit === 'mps') {
    return value;
  }

  const normalizedUnit = unit.toLowerCase().replace(/\s/g, '');
  const conversionFactor = UNIT_CONVERSIONS[normalizedUnit];

  if (!conversionFactor) {
    throw new Error(`Unsupported velocity unit: ${unit}`);
  }

  return value * conversionFactor;
};

/**
 * Convert distance to meters
 * @param {number} value - The distance value
 * @param {string} unit - The unit (e.g., 'km', 'm', 'cm')
 * @returns {number} - Distance in meters
 */
export const convertDistance = (value, unit) => {
  if (!unit || unit === 'm') {
    return value;
  }

  const normalizedUnit = unit.toLowerCase().replace(/\s/g, '');
  const conversionFactor = UNIT_CONVERSIONS[normalizedUnit];

  if (!conversionFactor) {
    throw new Error(`Unsupported distance unit: ${unit}`);
  }

  return value * conversionFactor;
};

/**
 * Parse numeric value with unit from text
 * @param {string} text - Text containing number and unit (e.g., "50 km/h")
 * @returns {object} - {value, unit}
 */
export const parseValueWithUnit = (text) => {
  const match = text.match(/(-?\d+\.?\d*)\s*([a-zA-Z/]+)?/);
  
  if (!match) {
    return null;
  }

  return {
    value: parseFloat(match[1]),
    unit: match[2] || null,
  };
};

export default {
  convertVelocity,
  convertDistance,
  parseValueWithUnit,
};