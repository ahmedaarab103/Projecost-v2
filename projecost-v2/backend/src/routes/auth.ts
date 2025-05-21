import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get current user
router.get('/me', authenticateUser, getCurrentUser);

export default router;