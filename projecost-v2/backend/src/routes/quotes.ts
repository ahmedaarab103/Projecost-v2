import express from 'express';
import {
  createQuote,
  getAllQuotes,
  getQuote,
  updateQuoteStatus,
  deleteQuote,
} from '../controllers/quoteController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

// Create a new quote (authenticated)
router.post('/', authenticateUser, createQuote);

// Get all quotes (authenticated)
router.get('/', authenticateUser, getAllQuotes);

// Get a single quote (authenticated)
router.get('/:id', authenticateUser, getQuote);

// Update a quote status (authenticated)
router.patch('/:id/status', authenticateUser, updateQuoteStatus);

// Delete a quote (authenticated)
router.delete('/:id', authenticateUser, deleteQuote);

export default router;