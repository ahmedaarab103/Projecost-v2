// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'freelancer' | 'agency' | 'admin';
  country: string;
  company?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Country types
export interface Country {
  _id: string;
  name: string;
  code: string;
  region: string;
  currency: string;
  currencyCode: string;
  multiplier: number;
}

// Service types
export interface ServiceTier {
  name: string;
  description: string;
  basePrice: number;
  deliveryTime: number;
  revisions: number;
  features: string[];
}

export interface Service {
  _id: string;
  name: string;
  category: string;
  description: string;
  userId: string;
  tiers: ServiceTier[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Quote types
export interface Quote {
  _id: string;
  clientId?: string;
  providerId?: string;
  serviceId: string;
  clientName: string;
  clientEmail: string;
  clientCountry: string;
  serviceName: string;
  serviceCategory: string;
  selectedTier: string;
  complexity: 'Basic' | 'Standard' | 'Advanced';
  basePrice: number;
  adjustedPrice: number;
  countryMultiplier: number;
  deliveryTime: number;
  description: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}