import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { newsAPI, availableTopics } from '../services/api';
import { ArticleCard } from '../components/ArticleCard';
import { SkeletonArticleCard } from '../components/SkeletonLoader';
import { Filter } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  topic: string;
  imageUrl?: string;
}

export function Feed() {
  const { token } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('all');

  useEffect(() => {
    loadArticles();
  }, [token, selectedTopic]);

  const loadArticles = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const filters = selectedTopic !== 'all' ? { topic: selectedTopic } : undefined;
      const data = await newsAPI.getFeed(token, filters);
      setArticles(data);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your News Feed</h1>
          <p className="text-gray-400">Personalized articles curated just for you</p>
        </div>

        <div className="mb-8 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Filter by Topic</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTopic('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedTopic === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              All Topics
            </button>
            {availableTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedTopic === topic
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonArticleCard key={i} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No articles found for this topic</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
