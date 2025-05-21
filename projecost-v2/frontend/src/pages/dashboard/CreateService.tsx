import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

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

const CreateService = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ServiceFormData>({
    defaultValues: {
      tiers: [
        { name: 'Basic', description: '', basePrice: 99, deliveryTime: 3 },
        { name: 'Standard', description: '', basePrice: 199, deliveryTime: 5 },
        { name: 'Premium', description: '', basePrice: 299, deliveryTime: 7 },
      ],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tiers',
  });
  
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
      await axios.post(`${API_URL}/services`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      navigate('/dashboard/services');
    } catch (err: any) {
      console.error('Error creating service:', err);
      setError(err.response?.data?.message || 'Failed to create service. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Service</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Add a new service to your portfolio to start receiving quotes
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
              {isSubmitting ? 'Creating...' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateService;