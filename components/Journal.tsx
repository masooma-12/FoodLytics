
import React from 'react';
import { FoodAnalysis } from '../types';

interface JournalProps {
  history: FoodAnalysis[];
}

const Journal: React.FC<JournalProps> = ({ history }) => {
  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Health Journal</h1>
        <p className="text-slate-500">Your nutrition journey over time.</p>
      </header>

      {history.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto flex items-center justify-center">
            <span className="text-4xl">📝</span>
          </div>
          <p className="text-slate-400 italic">No entries yet. Start by scanning food!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${
                item.rating === 'healthy' ? 'bg-emerald-500' :
                item.rating === 'moderate' ? 'bg-orange-400' : 'bg-red-500'
              }`} />
              
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-right">
                   <div className="text-xl font-black text-slate-800">{item.healthScore}%</div>
                   <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Score</div>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                {item.summary}
              </p>

              <div className="flex flex-wrap gap-2">
                {Object.entries(item.metrics).slice(0, 3).map(([key, val]) => (
                  <div key={key} className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 border border-slate-100">
                    {key}: {val}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Journal;
