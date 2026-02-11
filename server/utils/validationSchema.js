import { z } from 'zod';

export const parsedDataSchema = z.object({
  object: z.string().min(1, 'Object name is required'),
  motion_type: z.enum(['free_fall', 'vertical_throw'], {
    errorMap: () => ({ message: 'Motion type must be either free_fall or vertical_throw' }),
  }),
  initial_velocity: z.number().min(0, 'Initial velocity must be non-negative'),
  gravity: z.number().positive('Gravity must be positive'),
  direction: z.enum(['upward', 'downward'], {
    errorMap: () => ({ message: 'Direction must be either upward or downward' }),
  }),
});

// Additional business logic validation
export const validateParsedData = (data) => {
  // Validate parsed data schema
  const result = parsedDataSchema.safeParse(data);
  
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }

  const validated = result.data;

  // Business rule: free_fall must have velocity = 0 and direction = downward
  if (validated.motion_type === 'free_fall') {
    if (validated.initial_velocity !== 0) {
      throw new Error('Free fall must have initial velocity of 0');
    }
    if (validated.direction !== 'downward') {
      throw new Error('Free fall direction must be downward');
    }
  }

  // Business rule: vertical_throw must have velocity > 0
  if (validated.motion_type === 'vertical_throw') {
    if (validated.initial_velocity === 0) {
      throw new Error('Vertical throw must have initial velocity greater than 0');
    }
  }

  return validated;
};

export const inputTextSchema = z.object({
  problem_text: z
    .string()
    .min(10, 'Problem text must be at least 10 characters')
    .max(1000, 'Problem text cannot exceed 1000 characters')
    .trim(),
});