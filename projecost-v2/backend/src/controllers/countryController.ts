import { Request, Response } from 'express';
import Country from '../models/Country';

// Get all countries
export const getAllCountries = async (req: Request, res: Response) => {
  try {
    const countries = await Country.find().sort({ name: 1 });
    
    res.status(200).json({ countries, count: countries.length });
  } catch (error) {
    console.error('Get all countries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single country
export const getCountry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const country = await Country.findById(id);
    
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    
    res.status(200).json({ country });
  } catch (error) {
    console.error('Get country error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new country (admin only)
export const createCountry = async (req: Request, res: Response) => {
  try {
    const { name, code, region, currency, currencyCode, multiplier } = req.body;
    
    // Check if country already exists
    const existingCountry = await Country.findOne({ code });
    if (existingCountry) {
      return res.status(400).json({ message: 'Country already exists' });
    }
    
    const country = await Country.create({
      name,
      code,
      region,
      currency,
      currencyCode,
      multiplier,
    });
    
    res.status(201).json({ country });
  } catch (error) {
    console.error('Create country error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a country (admin only)
export const updateCountry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, code, region, currency, currencyCode, multiplier } = req.body;
    
    const country = await Country.findByIdAndUpdate(
      id,
      { name, code, region, currency, currencyCode, multiplier },
      { new: true, runValidators: true }
    );
    
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    
    res.status(200).json({ country });
  } catch (error) {
    console.error('Update country error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a country (admin only)
export const deleteCountry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const country = await Country.findByIdAndDelete(id);
    
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    
    res.status(200).json({ message: 'Country deleted successfully' });
  } catch (error) {
    console.error('Delete country error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};