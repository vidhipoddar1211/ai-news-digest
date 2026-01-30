import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { newsAPI } from '../services/api';
import { ArticleCard } from '../components/ArticleCard';
import { SkeletonArticleCard } from '../components/SkeletonLoader';
import { History as HistoryIcon } from 'lucide-react';

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

export function History() {
  const { token } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      if (!token) return;

      try {
        const data = await newsAPI.getHistory(token);
        setArticles(data);
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <HistoryIcon className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Reading History</h1>
          </div>
          <p className="text-gray-400">Previously viewed articles</p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonArticleCard key={i} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl">
            <HistoryIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No reading history yet</p>
            <p className="text-gray-500 mt-2">Articles you view will appear here</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Recent Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} {...article} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
