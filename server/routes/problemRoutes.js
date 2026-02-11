import express from 'express';
import { parseProblem } from '../controllers/problemController.js';

const router = express.Router();

/**
 * POST /api/parse
 * Parse physics word problem
 */
router.post('/parse', parseProblem);

export default router;