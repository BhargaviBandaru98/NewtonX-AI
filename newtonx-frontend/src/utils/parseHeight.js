/**
 * Extract initial height from problem text
 * @param {string} text - Problem text
 * @returns {number} - Initial height in meters
 */
export const extractHeight = (text) => {
  if (!text) return 0;

  const lowerText = text.toLowerCase();

  // Patterns to match height mentions
  const patterns = [
    /(?:from|at|of)\s+(\d+\.?\d*)\s*(?:m|meters?|metre?s?)\s+(?:high|height|above)/i,
    /(?:height|cliff|building|tower)\s+(?:of|at)?\s*(\d+\.?\d*)\s*(?:m|meters?|metre?s?)/i,
    /(\d+\.?\d*)\s*(?:m|meters?|metre?s?)\s+(?:high|height|above)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return parseFloat(match[1]);
    }
  }

  // Check for "ground level" or "ground"
  if (lowerText.includes('ground level') || lowerText.includes('from ground')) {
    return 0;
  }

  // Default to 0 if not found
  return 0;
};

export default extractHeight;