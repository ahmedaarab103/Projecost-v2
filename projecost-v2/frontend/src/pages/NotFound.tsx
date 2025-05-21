import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-red-800 dark:text-red-600">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-4 mb-6">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-6 py-3 text-lg font-medium rounded-md bg-red-800 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-600 shadow-md"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;