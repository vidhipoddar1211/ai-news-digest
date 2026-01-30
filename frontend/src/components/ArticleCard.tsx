import { ExternalLink, Clock, Tag } from 'lucide-react';

interface ArticleCardProps {
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  topic: string;
  imageUrl?: string;
}

export function ArticleCard({ title, summary, source, url, publishedAt, topic, imageUrl }: ArticleCardProps) {
  const timeAgo = getTimeAgo(publishedAt);

  return (
    <article className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-xs font-medium text-white rounded-full">
              {topic}
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
          <div className="flex items-center space-x-1">
            <Tag className="w-4 h-4" />
            <span>{source}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{timeAgo}</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="text-gray-400 mb-4 line-clamp-3">
          {summary}
        </p>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors group/link"
        >
          <span className="font-medium">Read More</span>
          <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </a>
      </div>
    </article>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
}
