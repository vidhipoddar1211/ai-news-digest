import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Newspaper, LogOut } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register' },
  ];

  const privateLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/feed', label: 'Feed' },
    { to: '/history', label: 'History' },
    { to: '/preferences', label: 'Preferences' },
    { to: '/profile', label: 'Profile' },
    { to: '/settings', label: 'Settings' },
  ];

  const links = user ? privateLinks : publicLinks;

  return (
    <nav className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              NewsDigest AI
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-red-900/30 transition-all flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
          <div className="px-4 py-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-red-900/30 transition-all flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
