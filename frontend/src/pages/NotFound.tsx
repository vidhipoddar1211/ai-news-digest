import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-gray-400 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 flex items-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          <Link
            to="/feed"
            className="px-6 py-3 bg-gray-800/50 backdrop-blur-sm text-white rounded-lg font-semibold border border-gray-700 hover:bg-gray-700/50 transition-all flex items-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Browse Feed</span>
          </Link>
        </div>

        <div className="mt-12 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400">
            Lost? Try navigating back to the home page or explore your personalized news feed.
          </p>
        </div>
      </div>
    </div>
  );
}
