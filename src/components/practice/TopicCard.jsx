import React from 'react';
import * as LucideIcons from 'lucide-react';

const TopicCard = ({ topic, onClick }) => {
  const Icon = LucideIcons[topic.icon] || LucideIcons.Code;

  return (
    <div
      onClick={() => onClick(topic.slug)}
      className="group relative cursor-pointer"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
      
      {/* Card Content */}
      <div className="relative flex flex-col h-full p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300 transform group-hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${topic.color || 'from-blue-500/20 to-purple-500/20'} border border-white/10`}>
            <Icon className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block mb-1">Solved</span>
            <span className="text-sm font-bold text-white">{topic.solvedCount || 0}/{topic.problemCount || 0}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {topic.name}
        </h3>
        
        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
          {topic.description || `Master ${topic.name} with ${topic.problemCount} curated problems.`}
        </p>

        {/* Difficulty Mix Indicator */}
        <div className="mt-auto space-y-3">
          <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-white/5">
            <div 
              className="bg-green-500" 
              style={{ width: `${(topic.difficultyMix?.Easy / topic.problemCount) * 100 || 0}%` }}
            />
            <div 
              className="bg-yellow-500" 
              style={{ width: `${(topic.difficultyMix?.Medium / topic.problemCount) * 100 || 0}%` }}
            />
            <div 
              className="bg-red-500" 
              style={{ width: `${(topic.difficultyMix?.Hard / topic.problemCount) * 100 || 0}%` }}
            />
          </div>
          
          <div className="flex justify-between text-[10px] text-gray-500 font-medium uppercase tracking-wider">
            <span>Easy</span>
            <span>Medium</span>
            <span>Hard</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
