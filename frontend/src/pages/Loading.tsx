import { Newspaper } from 'lucide-react';

export function Loading() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 animate-pulse">
          <Newspaper className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading NewsDigest AI</h2>
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
      </div>
    </div>
  );
}
