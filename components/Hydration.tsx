
import React, { useState } from 'react';
import { BeakerIcon, PlusIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { HydrationLog } from '../types';

interface HydrationProps {
  logs: HydrationLog[];
  onAdd: (amount: number) => void;
}

const Hydration: React.FC<HydrationProps> = ({ logs, onAdd }) => {
  const [selectedAmount, setSelectedAmount] = useState(250);
  const today = new Date().setHours(0, 0, 0, 0);
  const todayLogs = logs.filter(l => l.timestamp >= today);
  const totalToday = todayLogs.reduce((acc, curr) => acc + curr.amount, 0);
  const goal = 2500;
  const progress = Math.min((totalToday / goal) * 100, 100);

  const presets = [100, 250, 500, 750];

  return (
    <div className="p-6 space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Hydration Tracker</h1>
        <p className="text-slate-500">Stay hydrated for better focus and health.</p>
      </header>

      {/* Visual Cup */}
      <div className="relative flex flex-col items-center py-10">
        <div className="w-48 h-64 bg-slate-50 rounded-b-[40px] border-4 border-slate-200 relative overflow-hidden flex items-end">
           <div 
             className="w-full bg-blue-400 transition-all duration-700 ease-out" 
             style={{ height: `${progress}%` }}
           >
             <div className="absolute top-0 w-full h-4 bg-blue-300 opacity-50" style={{ transform: 'translateY(-50%)' }} />
           </div>
        </div>
        <div className="mt-6 text-center">
          <div className="text-4xl font-black text-slate-800">{totalToday}ml</div>
          <div className="text-sm font-medium text-slate-400 uppercase tracking-widest">of {goal}ml Goal</div>
        </div>
      </div>

      {/* Quick Add */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 px-2">Quick Add</h3>
        <div className="grid grid-cols-4 gap-3">
          {presets.map(amount => (
            <button
              key={amount}
              onClick={() => setSelectedAmount(amount)}
              className={`py-3 rounded-2xl font-bold border transition-all ${
                selectedAmount === amount 
                  ? 'bg-blue-500 border-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'
              }`}
            >
              {amount}ml
            </button>
          ))}
        </div>
        <button 
          onClick={() => onAdd(selectedAmount)}
          className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <PlusIcon className="w-6 h-6" />
          Add Water
        </button>
      </div>

      {/* Benefits */}
      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4">
        <div className="p-3 bg-white rounded-2xl h-fit">
          <SparklesIcon className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 mb-1">Did you know?</h4>
          <p className="text-blue-700 text-sm leading-relaxed">
            Proper hydration can help maintain blood pressure, improve joint health, and enhance physical performance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hydration;
