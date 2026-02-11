import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  original_text: {
    type: String,
    required: [true, 'Original text is required'],
    trim: true,
    maxlength: [1000, 'Problem text cannot exceed 1000 characters'],
  },
  parsed_data: {
    type: Object,
    required: [true, 'Parsed data is required'],
  },
  motion_type: {
    type: String,
    required: [true, 'Motion type is required'],
    enum: ['free_fall', 'vertical_throw'],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
problemSchema.index({ motion_type: 1, created_at: -1 });

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;