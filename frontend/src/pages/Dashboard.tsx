import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { newsAPI, preferencesAPI } from '../services/api';
import { Newspaper, TrendingUp, Calendar, Settings } from 'lucide-react';
import { SkeletonCard } from '../components/SkeletonLoader';

export function Dashboard() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    articlesCount: 0,
    topics: [] as string[],
    frequency: 'daily' as 'daily' | 'weekly',
  });

  useEffect(() => {
    const loadDashboard = async () => {
      if (!token) return;

      try {
        const [articles, preferences] = await Promise.all([
          newsAPI.getFeed(token),
          preferencesAPI.getPreferences(token),
        ]);

        setStats({
          articlesCount: articles.length,
          topics: preferences.topics,
          frequency: preferences.frequency,
        });
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-400">Here's your personalized news overview</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={<Newspaper className="w-8 h-8" />}
              title="Today's Articles"
              value={stats.articlesCount}
              color="from-blue-600 to-cyan-600"
            />
            <StatCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Active Topics"
              value={stats.topics.length}
              color="from-purple-600 to-pink-600"
            />
            <StatCard
              icon={<Calendar className="w-8 h-8" />}
              title="Delivery"
              value={stats.frequency}
              color="from-green-600 to-teal-600"
              isText
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <QuickLinkCard
            to="/feed"
            icon={<Newspaper className="w-6 h-6" />}
            title="View Feed"
            description="Browse your personalized news articles"
          />
          <QuickLinkCard
            to="/preferences"
            icon={<Settings className="w-6 h-6" />}
            title="Manage Preferences"
            description="Update topics and delivery settings"
          />
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-2">Your Topics</h2>
          <div className="flex flex-wrap gap-2">
            {stats.topics.length > 0 ? (
              stats.topics.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full text-sm"
                >
                  {topic}
                </span>
              ))
            ) : (
              <p className="text-gray-400">
                No topics selected.{' '}
                <Link to="/preferences" className="text-blue-400 hover:text-blue-300">
                  Add topics
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  color,
  isText = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  color: string;
  isText?: boolean;
}) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all">
      <div className={`p-3 bg-gradient-to-br ${color} bg-opacity-20 rounded-lg inline-block mb-4`}>
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className={`text-3xl font-bold text-white ${isText ? 'capitalize' : ''}`}>{value}</p>
    </div>
  );
}

function QuickLinkCard({
  to,
  icon,
  title,
  description,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg group-hover:scale-110 transition-transform">
          <div className="text-blue-400">{icon}</div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );
}
