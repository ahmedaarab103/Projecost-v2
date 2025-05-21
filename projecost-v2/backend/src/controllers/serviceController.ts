import { Request, Response } from 'express';
import Service from '../models/Service';

// Create a new service
export const createService = async (req: Request, res: Response) => {
  try {
    const { name, category, description, tiers } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication invalid' });
    }
    
    const service = await Service.create({
      name,
      category,
      description,
      userId: req.user._id,
      tiers,
    });
    
    res.status(201).json({ service });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all services
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    let query = {};
    
    if (category) {
      query = { category };
    }
    
    const services = await Service.find(query).populate('userId', 'name email role');
    
    res.status(200).json({ services, count: services.length });
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single service
export const getService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findById(id).populate('userId', 'name email role');
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.status(200).json({ service });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a service
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, description, tiers, isActive } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication invalid' });
    }
    
    const service = await Service.findById(id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Check if user is the owner of the service or an admin
    if (service.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }
    
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { name, category, description, tiers, isActive },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ service: updatedService });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a service
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication invalid' });
    }
    
    const service = await Service.findById(id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Check if user is the owner of the service or an admin
    if (service.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this service' });
    }
    
    await Service.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get services by user
export const getUserServices = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication invalid' });
    }
    
    const services = await Service.find({ userId: req.user._id });
    
    res.status(200).json({ services, count: services.length });
  } catch (error) {
    console.error('Get user services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};