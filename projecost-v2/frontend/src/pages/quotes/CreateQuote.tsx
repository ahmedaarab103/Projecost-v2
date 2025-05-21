import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Country, Service } from '../../../../shared/types';

interface QuoteFormData {
  serviceId: string;
  clientName: string;
  clientEmail: string;
  clientCountry: string;
  selectedTier: string;
  complexity: 'Basic' | 'Standard' | 'Advanced';
  description: string;
}

const CreateQuote = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuoteFormData>();
  
  const selectedServiceId = watch('serviceId');
  const selectedTier = watch('selectedTier');
  const selectedComplexity = watch('complexity');
  const selectedCountry = watch('clientCountry');
  
  // Fetch services and countries
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        // Fetch services
        const servicesResponse = await axios.get(`${API_URL}/services`);
        setServices(servicesResponse.data.services);
        
        // Fetch countries
        const countriesResponse = await axios.get(`${API_URL}/countries`);
        setCountries(countriesResponse.data.countries);
        
        // Pre-fill user data if authenticated
        if (isAuthenticated && user) {
          setValue('clientName', user.name);
          setValue('clientEmail', user.email);
          setValue('clientCountry', user.country);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load services or countries. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, user, setValue]);
  
  // Update selected service when serviceId changes
  useEffect(() => {
    if (selectedServiceId) {
      const service = services.find(s => s._id === selectedServiceId) || null;
      setSelectedService(service);
      
      // Reset tier selection when service changes
      if (service && service.tiers.length > 0) {
        setValue('selectedTier', service.tiers[0].name);
      }
    }
  }, [selectedServiceId, services, setValue]);
  
  // Calculate price estimate
  const calculatePrice = () => {
    if (!selectedService || !selectedTier || !selectedComplexity || !selectedCountry) {
      return null;
    }
    
    const tier = selectedService.tiers.find(t => t.name === selectedTier);
    if (!tier) return null;
    
    const country = countries.find(c => c.name === selectedCountry);
    if (!country) return null;
    
    const basePrice = tier.basePrice;
    const countryMultiplier = country.multiplier;
    
    // Apply complexity multiplier
    let complexityMultiplier = 1.0;
    if (selectedComplexity === 'Standard') {
      complexityMultiplier = 1.5;
    } else if (selectedComplexity === 'Advanced') {
      complexityMultiplier = 2.0;
    }
    
    const adjustedPrice = basePrice * countryMultiplier * complexityMultiplier;
    
    return {
      basePrice,
      countryMultiplier,
      complexityMultiplier,
      adjustedPrice,
      deliveryTime: tier.deliveryTime,
      currency: country.currencyCode,
    };
  };
  
  const priceEstimate = calculatePrice();
  
  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${API_URL}/quotes`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      // Navigate to quote result page
      navigate(`/quote/result/${response.data.quote._id}`);
    } catch (err: any) {
      console.error('Error creating quote:', err);
      setError(err.response?.data?.message || 'Failed to create quote. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800 dark:border-red-500"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get a Project Quote
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Fill in the details below to receive an accurate cost estimate
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Service selection */}
            <div>
              <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Service Type *
              </label>
              <select
                id="serviceId"
                {...register('serviceId', {
                  required: 'Please select a service',
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a service</option>
                {services.map(service => (
                  <option key={service._id} value={service._id}>
                    {service.name} - {service.category}
                  </option>
                ))}
              </select>
              {errors.serviceId && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.serviceId.message}</p>
              )}
            </div>
            
            {/* Service tiers (only shown when service is selected) */}
            {selectedService && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Service Tier *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedService.tiers.map((tier) => (
                    <div key={tier.name}>
                      <label className={`block p-4 border rounded-md cursor-pointer transition-colors ${
                        selectedTier === tier.name 
                          ? 'border-red-800 bg-red-50 dark:border-red-500 dark:bg-red-900/30' 
                          : 'border-gray-300 hover:border-red-300 dark:border-gray-600 dark:hover:border-red-700'
                      }`}>
                        <div className="flex items-start">
                          <input
                            type="radio"
                            value={tier.name}
                            {...register('selectedTier', {
                              required: 'Please select a tier',
                            })}
                            className="mt-1 h-4 w-4 text-red-800 dark:text-red-500 focus:ring-red-500"
                          />
                          <div className="ml-3">
                            <span className="block text-sm font-medium text-gray-900 dark:text-white">
                              {tier.name}
                            </span>
                            <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Base: ${tier.basePrice.toFixed(2)}
                            </span>
                            <span className="block text-sm text-gray-500 dark:text-gray-400">
                              Delivery: {tier.deliveryTime} days
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          {tier.description}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                {errors.selectedTier && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.selectedTier.message}</p>
                )}
              </div>
            )}
            
            {/* Project complexity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Complexity *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Basic', 'Standard', 'Advanced'].map((complexity) => (
                  <div key={complexity}>
                    <label className={`block p-4 border rounded-md cursor-pointer transition-colors ${
                      selectedComplexity === complexity 
                        ? 'border-red-800 bg-red-50 dark:border-red-500 dark:bg-red-900/30' 
                        : 'border-gray-300 hover:border-red-300 dark:border-gray-600 dark:hover:border-red-700'
                    }`}>
                      <div className="flex items-start">
                        <input
                          type="radio"
                          value={complexity}
                          {...register('complexity', {
                            required: 'Please select complexity level',
                          })}
                          className="mt-1 h-4 w-4 text-red-800 dark:text-red-500 focus:ring-red-500"
                        />
                        <div className="ml-3">
                          <span className="block text-sm font-medium text-gray-900 dark:text-white">
                            {complexity}
                          </span>
                          <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {complexity === 'Basic' && 'Simple project with minimal requirements'}
                            {complexity === 'Standard' && 'Average complexity with standard features'}
                            {complexity === 'Advanced' && 'Complex project with advanced requirements'}
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              {errors.complexity && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.complexity.message}</p>
              )}
            </div>
            
            {/* Client information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Name *
                </label>
                <input
                  id="clientName"
                  type="text"
                  {...register('clientName', {
                    required: 'Name is required',
                  })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                  placeholder="John Doe"
                />
                {errors.clientName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.clientName.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Email *
                </label>
                <input
                  id="clientEmail"
                  type="email"
                  {...register('clientEmail', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                  placeholder="your@email.com"
                />
                {errors.clientEmail && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.clientEmail.message}</p>
                )}
              </div>
            </div>
            
            {/* Country selection */}
            <div>
              <label htmlFor="clientCountry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Country *
              </label>
              <select
                id="clientCountry"
                {...register('clientCountry', {
                  required: 'Please select your country',
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select your country</option>
                {countries.map(country => (
                  <option key={country._id} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.clientCountry && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.clientCountry.message}</p>
              )}
            </div>
            
            {/* Project description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Description *
              </label>
              <textarea
                id="description"
                rows={4}
                {...register('description', {
                  required: 'Please provide a project description',
                  minLength: {
                    value: 20,
                    message: 'Description must be at least 20 characters',
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="Describe your project requirements, goals, and any specific details..."
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>
            
            {/* Price estimate */}
            {priceEstimate && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Price Estimate
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Base Price:</span>
                    <span className="text-gray-900 dark:text-white">${priceEstimate.basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Country Multiplier:</span>
                    <span className="text-gray-900 dark:text-white">x{priceEstimate.countryMultiplier.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Complexity Multiplier:</span>
                    <span className="text-gray-900 dark:text-white">x{priceEstimate.complexityMultiplier.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-900 dark:text-white">Total Estimate:</span>
                      <span className="text-red-800 dark:text-red-500 text-xl">
                        {priceEstimate.currency} ${priceEstimate.adjustedPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600 dark:text-gray-300">Estimated Delivery:</span>
                    <span className="text-gray-900 dark:text-white">{priceEstimate.deliveryTime} days</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Submit button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-800 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Get Quote'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuote;