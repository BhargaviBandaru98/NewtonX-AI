import groqClient from '../config/groq.js';

/**
 * Parse physics word problem using Groq API (Free)
 * Model: llama-3.3-70b-versatile
 * @param {string} problemText - The natural language physics problem
 * @returns {Promise<object>} - Structured physics data
 */
export const parsePhysicsProblem = async (problemText) => {
  try {
    const response = await groqClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: `You are a physics problem parser. Extract structured data from physics word problems and respond ONLY with valid JSON.

CRITICAL RULES:
1. Motion Types:
   - "free_fall": Object dropped from rest (initial_velocity = 0, direction = "downward")
   - "vertical_throw": Object thrown with initial velocity > 0 (direction = "upward" or "downward")

2. Units:
   - Convert ALL values to SI units (m/s for velocity, m/s² for gravity)
   - If units are missing, assume SI units (m/s)
   - Common conversions: km/h → m/s (÷3.6), cm/s → m/s (÷100)

3. Gravity:
   - Default gravity = 9.8 m/s² if not specified
   - Use provided value if mentioned

4. Direction Detection:
   - "thrown upward", "tossed up", "launched upward" → "upward"
   - "thrown downward", "tossed down" → "downward"
   - "dropped", "falls", "released" → "downward" (free_fall if no initial velocity)

5. Initial Velocity:
   - For free_fall: MUST be 0
   - For vertical_throw: MUST be > 0

6. Error Handling:
   - If motion type cannot be determined → set motion_type to "unknown"

REQUIRED JSON FORMAT (respond with ONLY this JSON, no other text):
{
  "object": "string (e.g., ball, stone, rock)",
  "motion_type": "free_fall OR vertical_throw OR unknown",
  "initial_velocity": number (in m/s),
  "gravity": number (in m/s²),
  "direction": "upward OR downward"
}`,
        },
        {
          role: 'user',
          content: problemText,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    const parsedData = JSON.parse(content);

    // Validate required fields exist
    if (!parsedData.object || !parsedData.motion_type || 
        parsedData.initial_velocity === undefined || 
        !parsedData.gravity || !parsedData.direction) {
      throw new Error('AI response missing required fields');
    }

    // Check if AI couldn't determine motion type
    if (parsedData.motion_type === 'unknown') {
      throw new Error('Unable to determine motion type from the problem description. Please provide more details.');
    }

    return parsedData;
  } catch (error) {
    if (error.message.includes('Unable to determine motion type')) {
      throw error;
    }

    if (error.message.includes('missing required fields')) {
      throw error;
    }

    if (error.response) {
      throw new Error(`Groq API Error: ${error.response.data.error.message}`);
    }

    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse AI response as JSON');
    }

    throw new Error(`AI Parsing Error: ${error.message}`);
  }
};

export default {
  parsePhysicsProblem,
};