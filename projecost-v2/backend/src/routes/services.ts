import express from 'express';
import {
  createService,
  getAllServices,
  getService,
  updateService,
  deleteService,
  getUserServices,
} from '../controllers/serviceController';
import { authenticateUser, authorizeProvider } from '../middleware/auth';

const router = express.Router();

// Get all services (public)
router.get('/', getAllServices);

// Get a single service (public)
router.get('/:id', getService);

// Get services by user (authenticated)
router.get('/user/me', authenticateUser, getUserServices);

// Create a new service (provider only)
router.post('/', authenticateUser, authorizeProvider, createService);

// Update a service (provider only)
router.put('/:id', authenticateUser, updateService);

// Delete a service (provider only)
router.delete('/:id', authenticateUser, deleteService);

export default router;