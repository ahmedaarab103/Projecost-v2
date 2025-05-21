import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Service } from '../../../../shared/types';

interface ServiceTier {
  name: string;
  description: string;
  basePrice: number;
  deliveryTime: number;
}

interface ServiceFormData {
  name: string;
  category: string;
  description: string;
  tiers: ServiceTier[];
}

const EditService = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    defaultValues: {
      tiers: [
        { name: 'Basic', description: '', basePrice: 99, deliveryTime: 3 },
      ],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tiers',
  });
  
  // Fetch service data
  useEffect(() => {
    const fetchService = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${API_URL}/services/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        const service = response.data.service;
        
        // Reset form with service data
        reset({
          name: service.name,
          category: service.category,
          description: service.description,
          tiers: service.tiers,
        });
      } catch (err: any) {
        console.error('Error fetching service:', err);
        setError(err.response?.data?.message || 'Failed to load service. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchService();
    }
  }, [id, reset]);
  
  const serviceCategories = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Graphic Design',
    'Logo Design',
    'Video Editing',
    '3D Modeling',
    'Animation',
    'Content Writing',
    'Translation',
    'Voice Over',
    'Digital Marketing',
    'SEO',
    'Social Media Management',
    'Other',
  ];
  
  const onSubmit = async (data: ServiceFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.put(`${API_URL}/services/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      navigate('/dashboard/services');
    } catch (err: any) {
      console.error('Error updating service:', err);
      setError(err.response?.data?.message || 'Failed to update service. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800 dark:border-red-500"></div>
      </div>
    );
  }
  
  if (error && !fields[0].name) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-800 dark:text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Service Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {error || 'The service you are trying to edit could not be found.'}
        </p>
        <button
          onClick={() => navigate('/dashboard/services')}
          className="px-4 py-2 bg-red-800 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600"
        >
          Back to Services
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Service</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Update your service details and pricing tiers
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic service information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Service Name *
              </label>
              <input
                id="name"
                type="text"
                {...register('name', {
                  required: 'Service name is required',
                  minLength: {
                    value: 3,
                    message: 'Service name must be at least 3 characters',
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Professional Website Design"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category *
              </label>
              <select
                id="category"
                {...register('category', {
                  required: 'Please select a category',
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a category</option>
                {serviceCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
              )}
            </div>
          </div>
          
          {/* Service description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 20,
                  message: 'Description must be at least 20 characters',
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe your service in detail..."
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
            )}
          </div>
          
          {/* Service tiers */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Service Tiers
              </h2>
              {fields.length < 5 && (
                <button
                  type="button"
                  onClick={() => append({ name: '', description: '', basePrice: 99, deliveryTime: 3 })}
                  className="text-sm font-medium text-red-800 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400"
                >
                  + Add Tier
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white">
                      Tier {index + 1}
                    </h3>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-800 dark:hover:text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tier Name *
                      </label>
                      <input
                        type="text"
                        {...register(`tiers.${index}.name` as const, {
                          required: 'Tier name is required',
                        })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., Basic, Standard, Premium"
                      />
                      {errors.tiers?.[index]?.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.tiers[index]?.name?.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Base Price ($) *
                        </label>
                        <input
                          type="number"
                          {...register(`tiers.${index}.basePrice` as const, {
                            required: 'Price is required',
                            min: {
                              value: 1,
                              message: 'Price must be at least $1',
                            },
                          })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                          placeholder="99"
                        />
                        {errors.tiers?.[index]?.basePrice && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.tiers[index]?.basePrice?.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Delivery (days) *
                        </label>
                        <input
                          type="number"
                          {...register(`tiers.${index}.deliveryTime` as const, {
                            required: 'Delivery time is required',
                            min: {
                              value: 1,
                              message: 'Delivery time must be at least 1 day',
                            },
                          })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                          placeholder="3"
                        />
                        {errors.tiers?.[index]?.deliveryTime && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.tiers[index]?.deliveryTime?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tier Description *
                    </label>
                    <textarea
                      rows={2}
                      {...register(`tiers.${index}.description` as const, {
                        required: 'Tier description is required',
                      })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                      placeholder="What's included in this tier..."
                    ></textarea>
                    {errors.tiers?.[index]?.description && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.tiers[index]?.description?.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-red-800 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Update Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditService;