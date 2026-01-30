import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { preferencesAPI, availableTopics } from '../services/api';
import { TopicSelector } from '../components/TopicSelector';
import { Toast } from '../components/Toast';
import { Save, Calendar } from 'lucide-react';

export function Preferences() {
  const { token } = useAuth();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!token) return;

      try {
        const prefs = await preferencesAPI.getPreferences(token);
        setSelectedTopics(prefs.topics);
        setFrequency(prefs.frequency);
      } catch (error) {
        console.error('Failed to load preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [token]);

  const handleSave = async () => {
    if (!token) return;

    if (selectedTopics.length === 0) {
      setToast({ message: 'Please select at least one topic', type: 'error' });
      return;
    }

    setSaving(true);

    try {
      await preferencesAPI.updatePreferences(token, {
        topics: selectedTopics,
        frequency,
        emailEnabled: true,
      });
      setToast({ message: 'Preferences saved successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to save preferences', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Preferences</h1>
          <p className="text-gray-400">Customize your news digest experience</p>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Select Topics</h2>
            <p className="text-gray-400 mb-6">Choose the topics you're interested in</p>
            <TopicSelector
              availableTopics={availableTopics}
              selectedTopics={selectedTopics}
              onChange={setSelectedTopics}
            />
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Delivery Frequency</h2>
            </div>
            <p className="text-gray-400 mb-6">How often would you like to receive your digest?</p>
            <div className="flex space-x-4">
              <button
                onClick={() => setFrequency('daily')}
                className={`flex-1 py-4 rounded-lg font-medium transition-all ${
                  frequency === 'daily'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setFrequency('weekly')}
                className={`flex-1 py-4 rounded-lg font-medium transition-all ${
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
                <span>Save Preferences</span>
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
