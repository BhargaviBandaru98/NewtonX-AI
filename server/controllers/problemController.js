import Problem from '../models/Problem.js';
import { parsePhysicsProblem } from '../services/aiParser.js';
import { validateParsedData, inputTextSchema } from '../utils/validationSchema.js';

/**
 * POST /api/parse
 * Parse physics word problem and return structured data
 */
export const parseProblem = async (req, res, next) => {
  try {
    // Step 1: Validate input
    const inputValidation = inputTextSchema.safeParse(req.body);
    
    if (!inputValidation.success) {
      return res.status(400).json({
        success: false,
        error: inputValidation.error.errors[0].message,
      });
    }

    const { problem_text } = inputValidation.data;

    // Step 2: Parse with AI
    let parsedData;
    try {
      parsedData = await parsePhysicsProblem(problem_text);
    } catch (aiError) {
      return res.status(422).json({
        success: false,
        error: `AI Parsing Failed: ${aiError.message}`,
        details: 'The problem description may be ambiguous or incomplete.',
      });
    }

    // Step 3: Validate parsed data with Zod + business rules
    let validatedData;
    try {
      validatedData = validateParsedData(parsedData);
    } catch (validationError) {
      return res.status(422).json({
        success: false,
        error: `Validation Failed: ${validationError.message}`,
        parsed_data: parsedData,
      });
    }

    // Step 4: Save to database
    const problem = new Problem({
      original_text: problem_text,
      parsed_data: validatedData,
      motion_type: validatedData.motion_type,
    });

    await problem.save();

    // Step 5: Return success response
    return res.status(200).json({
      success: true,
      data: {
        id: problem._id,
        parsed_data: validatedData,
        original_text: problem_text,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  parseProblem,
};