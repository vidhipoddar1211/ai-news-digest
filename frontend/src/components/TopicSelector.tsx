import { Check } from 'lucide-react';

interface TopicSelectorProps {
  availableTopics: string[];
  selectedTopics: string[];
  onChange: (topics: string[]) => void;
}

export function TopicSelector({ availableTopics, selectedTopics, onChange }: TopicSelectorProps) {
  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      onChange(selectedTopics.filter(t => t !== topic));
    } else {
      onChange([...selectedTopics, topic]);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {availableTopics.map((topic) => {
        const isSelected = selectedTopics.includes(topic);
        return (
          <button
            key={topic}
            onClick={() => toggleTopic(topic)}
            className={`
              px-4 py-2 rounded-full font-medium transition-all
              ${isSelected
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
              }
            `}
          >
            <span className="flex items-center space-x-2">
              {isSelected && <Check className="w-4 h-4" />}
              <span>{topic}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
