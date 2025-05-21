import express from 'express';
import {
  getAllCountries,
  getCountry,
  createCountry,
  updateCountry,
  deleteCountry,
} from '../controllers/countryController';
import { authenticateUser, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Get all countries (public)
router.get('/', getAllCountries);

// Get a single country (public)
router.get('/:id', getCountry);

// Create a new country (admin only)
router.post('/', authenticateUser, authorizeAdmin, createCountry);

// Update a country (admin only)
router.put('/:id', authenticateUser, authorizeAdmin, updateCountry);

// Delete a country (admin only)
router.delete('/:id', authenticateUser, authorizeAdmin, deleteCountry);

export default router;