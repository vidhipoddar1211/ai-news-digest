import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    info: <AlertCircle className="w-5 h-5 text-blue-400" />,
  };

  const styles = {
    success: 'bg-green-900/50 border-green-500/50',
    error: 'bg-red-900/50 border-red-500/50',
    info: 'bg-blue-900/50 border-blue-500/50',
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md animate-slide-in`}>
      <div className={`${styles[type]} backdrop-blur-lg border rounded-lg p-4 shadow-lg flex items-center space-x-3`}>
        {icons[type]}
        <p className="text-white flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
