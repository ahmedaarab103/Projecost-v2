import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend the Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Interface for JWT payload
interface JwtPayload {
  userId: string;
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  // Check for token in headers
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication invalid' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as JwtPayload;
    
    // Attach user to request object
    const user = await User.findById(payload.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication invalid' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication invalid' });
  }
};

// Middleware to check if user is admin
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

// Middleware to check if user is a service provider (freelancer or agency)
export const authorizeProvider = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === 'freelancer' || req.user.role === 'agency')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Provider privileges required.' });
  }
};