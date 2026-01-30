import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { preferencesAPI } from '../services/api';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { Toast } from '../components/Toast';
import { Save, Mail, Bell } from 'lucide-react';

export function Settings() {
  const { token } = useAuth();
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      if (!token) return;

      try {
        const prefs = await preferencesAPI.getPreferences(token);
        setEmailEnabled(prefs.emailEnabled);
        setFrequency(prefs.frequency);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [token]);

  const handleSave = async () => {
    if (!token) return;

    setSaving(true);

    try {
      const currentPrefs = await preferencesAPI.getPreferences(token);
      await preferencesAPI.updatePreferences(token, {
        ...currentPrefs,
        emailEnabled,
        frequency,
      });
      setToast({ message: 'Settings saved successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to save settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account and notification preferences</p>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-900/20 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Email Delivery</h3>
                  <p className="text-gray-400 text-sm">
                    Receive your personalized news digest via email
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={emailEnabled}
                onChange={setEmailEnabled}
                label="Email Delivery"
              />
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <Bell className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Digest Frequency</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Choose how often you want to receive your digest
                </p>
              </div>
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => setFrequency('daily')}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  frequency === 'daily'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setFrequency('weekly')}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  frequency === 'weekly'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
                }`}
              >
                Weekly
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {saving ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
