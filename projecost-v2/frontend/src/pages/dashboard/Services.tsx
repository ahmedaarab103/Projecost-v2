import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Service } from '../../../../shared/types';

const Services = () => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${API_URL}/services/user/me`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        setServices(response.data.services);
      } catch (err: any) {
        console.error('Error fetching services:', err);
        setError(err.response?.data?.message || 'Failed to load services. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  const handleDeleteService = async (serviceId: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.delete(`${API_URL}/services/${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      // Remove the deleted service from the state
      setServices(services.filter(service => service._id !== serviceId));
    } catch (err: any) {
      console.error('Error deleting service:', err);
      alert(err.response?.data?.message || 'Failed to delete service. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800 dark:border-red-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Services</h1>
        <Link
          to="/dashboard/services/create"
          className="px-4 py-2 bg-red-800 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600"
        >
          Add New Service
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {services.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Services Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You haven't created any services yet. Add your first service to start receiving quotes.
          </p>
          <Link
            to="/dashboard/services/create"
            className="px-4 py-2 bg-red-800 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600"
          >
            Create Your First Service
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {service.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {service.category}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {service.description}
                </p>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.tiers.map((tier) => (
                      <span key={tier.name} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs rounded-full">
                        {tier.name}: ${tier.basePrice}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between">
                    <Link
                      to={`/dashboard/services/edit/${service._id}`}
                      className="text-sm font-medium text-red-800 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-800 dark:hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;