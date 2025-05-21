import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Quote } from '../../../../shared/types';

const QuoteDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchQuote = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${API_URL}/quotes/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        setQuote(response.data.quote);
      } catch (err: any) {
        console.error('Error fetching quote:', err);
        setError(err.response?.data?.message || 'Failed to load quote. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchQuote();
    }
  }, [id]);
  
  const handleUpdateStatus = async (status: 'accepted' | 'rejected' | 'completed') => {
    if (!quote) return;
    
    setIsUpdating(true);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.patch(
        `${API_URL}/quotes/${quote._id}/status`,
        { status },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      setQuote(response.data.quote);
    } catch (err: any) {
      console.error('Error updating quote status:', err);
      setError(err.response?.data?.message || 'Failed to update quote status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800 dark:border-red-500"></div>
      </div>
    );
  }
  
  if (error || !quote) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-800 dark:text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Quote Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {error || 'The quote you are looking for could not be found.'}
        </p>
        <Link
          to="/dashboard/quotes"
          className="px-4 py-2 bg-red-800 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600"
        >
          Back to Quotes
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Quote header */}
      <div className="bg-red-800 dark:bg-red-900 text-white p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Quote Details</h1>
            <p className="text-red-100">Quote #{quote._id.substring(0, 8)}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold 
              ${quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
              ${quote.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
              ${quote.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
              ${quote.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
            `}>
              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Quote content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Service details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Service Details
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Service</p>
                <p className="text-gray-900 dark:text-white font-medium">{quote.serviceName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                <p className="text-gray-900 dark:text-white font-medium">{quote.serviceCategory}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Selected Tier</p>
                <p className="text-gray-900 dark:text-white font-medium">{quote.selectedTier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Complexity</p>
                <p className="text-gray-900 dark:text-white font-medium">{quote.complexity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Delivery</p>
                <p className="text-gray-900 dark:text-white font-medium">{quote.deliveryTime} days</p>
              </div>
            </div>
          </div>
          
          {/* Client/Provider details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {user?.role === 'client' ? 'Provider Information' : 'Client Information'}
            </h2>
            <div className="space-y-3">
              {user?.role === 'client' ? (
                <>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Provider</p>
                    <p className="text-gray-900 dark:text-white font-medium">{quote.providerName || 'Service Provider'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white font-medium">{quote.providerEmail || 'Not available'}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Client</p>
                    <p className="text-gray-900 dark:text-white font-medium">{quote.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white font-medium">{quote.clientEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Country</p>
                    <p className="text-gray-900 dark:text-white font-medium">{quote.clientCountry}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Quote Date</p>
                <p className="text-gray-900 dark:text-white font-medium">{formatDate(quote.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Valid Until</p>
                <p className="text-gray-900 dark:text-white font-medium">{formatDate(quote.expiresAt)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Project description */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Project Description
          </h2>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {quote.description}
            </p>
          </div>
        </div>
        
        {/* Price breakdown */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Price Breakdown
          </h2>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Base Price:</span>
                <span className="text-gray-900 dark:text-white">${quote.basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Country Multiplier:</span>
                <span className="text-gray-900 dark:text-white">x{quote.countryMultiplier.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Complexity Multiplier:</span>
                <span className="text-gray-900 dark:text-white">
                  x{(quote.adjustedPrice / (quote.basePrice * quote.countryMultiplier)).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-900 dark:text-white">Total Price:</span>
                  <span className="text-red-800 dark:text-red-500 text-xl">
                    ${quote.adjustedPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Quote
            </button>
          </div>
          
          {/* Status update buttons */}
          {user?.role !== 'client' && quote.status === 'pending' && (
            <div className="flex space-x-4">
              <button
                onClick={() => handleUpdateStatus('accepted')}
                disabled={isUpdating}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Accept Quote
              </button>
              <button
                onClick={() => handleUpdateStatus('rejected')}
                disabled={isUpdating}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject Quote
              </button>
            </div>
          )}
          
          {user?.role !== 'client' && quote.status === 'accepted' && (
            <button
              onClick={() => handleUpdateStatus('completed')}
              disabled={isUpdating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark as Completed
            </button>
          )}
          
          {user?.role === 'client' && quote.status === 'pending' && (
            <div className="text-gray-600 dark:text-gray-300 italic">
              Waiting for provider to accept or reject this quote
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteDetails;