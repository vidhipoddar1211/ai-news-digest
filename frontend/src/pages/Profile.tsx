import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  const accountDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
          <p className="text-gray-400">View your account information</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          <div className="p-8 -mt-16">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-gray-900">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1 pt-8">
                <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                <p className="text-gray-400">NewsDigest AI Member</p>
              </div>
            </div>
          </div>

          <div className="px-8 pb-8 space-y-6">
            <ProfileField
              icon={<Mail className="w-5 h-5" />}
              label="Email Address"
              value={user.email}
            />
            <ProfileField
              icon={<Calendar className="w-5 h-5" />}
              label="Member Since"
              value={accountDate}
            />
            <ProfileField
              icon={<User className="w-5 h-5" />}
              label="Account ID"
              value={user.id}
            />
          </div>
        </div>

        <div className="mt-6 bg-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4">
          <p className="text-sm text-blue-300">
            Your profile information is read-only. To update your preferences or settings, visit the respective pages.
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        <p className="text-white font-medium">{value}</p>
      </div>
    </div>
  );
}
