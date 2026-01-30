import { Newspaper } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900/50 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Newspaper className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-400">
              NewsDigest AI &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <a href="/about" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
