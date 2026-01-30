import { Link } from 'react-router-dom';
import { Sparkles, Mail, Brain, Shield, Clock, TrendingUp } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-900/30 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300 font-medium">AI-Powered News Curation</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Your Personalized
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                News Digest
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
              Stay informed with AI-curated news tailored to your interests.
              Get your personalized digest delivered daily or weekly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-gray-800/50 backdrop-blur-sm text-white rounded-lg font-semibold border border-gray-700 hover:bg-gray-700/50 transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <FeatureCard
              icon={<Brain className="w-8 h-8" />}
              title="AI-Powered Curation"
              description="Our advanced AI learns your preferences and curates the most relevant news for you."
            />
            <FeatureCard
              icon={<Mail className="w-8 h-8" />}
              title="Email Delivery"
              description="Receive your personalized news digest directly to your inbox on your schedule."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Privacy First"
              description="Your data is secure and private. We never share your information."
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8" />}
              title="Save Time"
              description="No more scrolling through endless feeds. Get the news that matters in minutes."
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Stay Updated"
              description="Never miss important news in your areas of interest with real-time updates."
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Smart Summaries"
              description="Get concise, AI-generated summaries so you can stay informed faster."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
      <div className="p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform">
        <div className="text-blue-400">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
