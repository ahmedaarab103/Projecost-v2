import { Request, Response } from 'express';
import Quote from '../models/Quote';
import Service from '../models/Service';
import Country from '../models/Country';

// Create a new quote
export const createQuote = async (req: Request, res: Response) => {
  try {
    const {
      serviceId,
      clientName,
      clientEmail,
      clientCountry,
      selectedTier,
      complexity,
      description,
    } = req.body;
    
    // Get the service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Get the country multiplier
    const country = await Country.findOne({ name: clientCountry });
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    
    // Find the selected tier
    const tier = service.tiers.find(t => t.name === selectedTier);
    if (!tier) {
      return res.status(404).json({ message: 'Tier not found' });
    }
    
    // Calculate the adjusted price based on country multiplier
    const basePrice = tier.basePrice;
    const countryMultiplier = country.multiplier;
    
    // Apply complexity multiplier
    let complexityMultiplier = 1.0;
    if (complexity === 'Standard') {
      complexityMultiplier = 1.5;
    } else if (complexity === 'Advanced') {
      complexityMultiplier = 2.0;
    }
    
    const adjustedPrice = basePrice * countryMultiplier * complexityMultiplier;
    
    // Create the quote
    const quote = await Quote.create({
      clientId: req.user?._id,
      providerId: service.userId,
      serviceId,
      clientName,
      clientEmail,
      clientCountry,
      serviceName: service.name,
      serviceCategory: service.category,
      selectedTier,
      complexity,
      basePrice,
      adjustedPrice,
      countryMultiplier,
      deliveryTime: tier.deliveryTime,
      description,
    });
    
    res.status(201).json({ quote });
  } catch (error) {
    console.error('Create quote error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all quotes
export const getAllQuotes = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication invalid' });
    }
    
    let quotes;
    
    // If user is admin, return all quotes
    if (req.user.role === 'admin') {
      quotes = await Quote.find();
    } 
    // If user is a provider, return quotes where they are the provider
    else if (req.user.role === 'freelancer' || req.user.role === 'agency') {
      quotes = await Quote.find({ providerId: req.user._id });
    } 
    // If user is a client, return quotes where they are the client
    else {
      quotes = await Quote.find({ clientId: req.user._id });
    }
    
    res.status(200).json({ quotes, count: quotes.length });
  } catch (error) {
    console.error('Get all quotes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single quote
export const getQuote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const quote = await Quote.findById(id);
    
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    
    // Check if user is authorized to view this quote
    if (
      req.user &&
      (req.user.role === 'admin' ||
        (quote.clientId && quote.clientId.toString() === req.user._id.toString()) ||
        (quote.providerId && quote.providerId.toString() === req.user._id.toString()))
    ) {
      return res.status(200).json({ quote });
    }
    
    res.status(403).json({ message: 'Not authorized to view this quote' });
  } catch (error) {
    console.error('Get quote error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a quote status
export const updateQuoteStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const quote = await Quote.findById(id);
    
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    
    // Check if user is authorized to update this quote
    if (
      req.user &&
      (req.user.role === 'admin' ||
        (quote.providerId && quote.providerId.toString() === req.user._id.toString()))
    ) {
      const updatedQuote = await Quote.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );
      
      return res.status(200).json({ quote: updatedQuote });
    }
    
    res.status(403).json({ message: 'Not authorized to update this quote' });
  } catch (error) {
    console.error('Update quote status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a quote
export const deleteQuote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const quote = await Quote.findById(id);
    
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    
    // Check if user is authorized to delete this quote
    if (
      req.user &&
      (req.user.role === 'admin' ||
        (quote.providerId && quote.providerId.toString() === req.user._id.toString()))
    ) {
      await Quote.findByIdAndDelete(id);
      
      return res.status(200).json({ message: 'Quote deleted successfully' });
    }
    
    res.status(403).json({ message: 'Not authorized to delete this quote' });
  } catch (error) {
    console.error('Delete quote error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};