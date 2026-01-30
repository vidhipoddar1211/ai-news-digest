import { Brain, Shield, Zap, Users } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-gray-950 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">NewsDigest AI</span>
          </h1>
          <p className="text-xl text-gray-400">
            Personalized news curation powered by artificial intelligence
          </p>
        </div>

        <div className="space-y-12">
          <Section
            icon={<Brain className="w-8 h-8" />}
            title="What We Do"
            content="NewsDigest AI uses advanced machine learning algorithms to understand your interests and deliver personalized news digests. We analyze thousands of sources to find the most relevant and important stories for you."
          />

          <Section
            icon={<Zap className="w-8 h-8" />}
            title="How It Works"
            content="Simply select your topics of interest and preferred delivery frequency. Our AI engine continuously learns from your reading habits and refines your news feed over time. You can receive your digest daily or weekly via email, or browse anytime on our platform."
          />

          <Section
            icon={<Shield className="w-8 h-8" />}
            title="Privacy & Security"
            content="Your privacy is our top priority. We use industry-standard encryption to protect your data. We never sell your information to third parties, and you have complete control over your preferences and data at all times."
          />

          <Section
            icon={<Users className="w-8 h-8" />}
            title="Our Mission"
            content="In an age of information overload, we believe everyone deserves access to news that matters to them without the noise. Our mission is to help you stay informed efficiently, saving you time while keeping you connected to the topics you care about."
          />
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-6">Join thousands of users who stay informed with NewsDigest AI</p>
          <a
            href="/register"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105"
          >
            Create Free Account
          </a>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg flex-shrink-0">
          <div className="text-blue-400">{icon}</div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
          <p className="text-gray-400 leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );
}
