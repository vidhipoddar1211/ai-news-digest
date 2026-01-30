const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
  };
}

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

interface Preferences {
  topics: string[];
  frequency: 'daily' | 'weekly';
  emailEnabled: boolean;
}

const mockUser = {
  id: '1',
  email: 'demo@newsdigest.ai',
  name: 'Demo User',
  createdAt: new Date().toISOString(),
};

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Breaking: Major Breakthrough in AI Technology',
    summary: 'Researchers have developed a new AI model that achieves unprecedented accuracy in natural language understanding...',
    source: 'TechCrunch',
    url: 'https://example.com/article1',
    publishedAt: new Date().toISOString(),
    topic: 'Technology',
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2',
    title: 'Global Markets Rally on Economic Data',
    summary: 'Stock markets around the world surged today following positive economic indicators and strong corporate earnings...',
    source: 'Bloomberg',
    url: 'https://example.com/article2',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    topic: 'Business',
    imageUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '3',
    title: 'New Study Reveals Health Benefits of Mediterranean Diet',
    summary: 'A comprehensive 10-year study shows significant improvements in cardiovascular health for those following...',
    source: 'Health News',
    url: 'https://example.com/article3',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    topic: 'Health',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '4',
    title: 'SpaceX Successfully Launches Next-Generation Satellite',
    summary: 'The aerospace company achieved another milestone with the successful deployment of advanced communication satellites...',
    source: 'Space.com',
    url: 'https://example.com/article4',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    topic: 'Science',
    imageUrl: 'https://images.pexels.com/photos/586056/pexels-photo-586056.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '5',
    title: 'Climate Summit Reaches Historic Agreement',
    summary: 'World leaders have signed a landmark treaty committing to aggressive carbon reduction targets by 2030...',
    source: 'Reuters',
    url: 'https://example.com/article5',
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    topic: 'Environment',
    imageUrl: 'https://images.pexels.com/photos/3039036/pexels-photo-3039036.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '6',
    title: 'Revolutionary Electric Vehicle Breaks Range Record',
    summary: 'New battery technology enables a single charge to power over 1000 miles of driving, changing the EV landscape...',
    source: 'AutoNews',
    url: 'https://example.com/article6',
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    topic: 'Technology',
    imageUrl: 'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export const authAPI = {
  async login(email: string, password: string): Promise<LoginResponse> {
    await new Promise(resolve => setTimeout(resolve, 800));

    if (email && password.length >= 6) {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: mockUser,
      };
    }
    throw new Error('Invalid credentials');
  },

  async register(name: string, email: string, password: string): Promise<LoginResponse> {
    await new Promise(resolve => setTimeout(resolve, 800));

    if (name && email && password.length >= 6) {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: { ...mockUser, name, email },
      };
    }
    throw new Error('Invalid registration data');
  },

  async getProfile(token: string) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockUser;
  },
};

export const newsAPI = {
  async getFeed(token: string, filters?: { topic?: string }): Promise<Article[]> {
    await new Promise(resolve => setTimeout(resolve, 600));

    if (filters?.topic && filters.topic !== 'all') {
      return mockArticles.filter(article => article.topic === filters.topic);
    }
    return mockArticles;
  },

  async getHistory(token: string): Promise<Article[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockArticles.slice(0, 4);
  },

  async getArticle(token: string, id: string): Promise<Article> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const article = mockArticles.find(a => a.id === id);
    if (!article) throw new Error('Article not found');
    return article;
  },
};

export const preferencesAPI = {
  async getPreferences(token: string): Promise<Preferences> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const stored = localStorage.getItem('preferences');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      topics: ['Technology', 'Business'],
      frequency: 'daily',
      emailEnabled: true,
    };
  },

  async updatePreferences(token: string, preferences: Preferences): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.setItem('preferences', JSON.stringify(preferences));
  },
};

export const availableTopics = [
  'Technology',
  'Business',
  'Science',
  'Health',
  'Environment',
  'Politics',
  'Sports',
  'Entertainment',
];
