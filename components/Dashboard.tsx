
import React from 'react';
import { FoodAnalysis, HydrationLog, UserProfile } from '../types';
import { FireIcon, BoltIcon, HeartIcon, CloudIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';

interface DashboardProps {
  scanHistory: FoodAnalysis[];
  hydrationLogs: HydrationLog[];
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ scanHistory, hydrationLogs, profile }) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const todayScans = scanHistory.filter(s => s.timestamp >= today);
  const todayWater = hydrationLogs.filter(l => l.timestamp >= today).reduce((acc, curr) => acc + curr.amount, 0);
  const waterGoal = 2500;
  const waterProgress = Math.min((todayWater / waterGoal) * 100, 100);

  const averageHealthScore = todayScans.length > 0 
    ? Math.round(todayScans.reduce((acc, curr) => acc + curr.healthScore, 0) / todayScans.length)
    : 0;

  return (
    <div className="p-6 space-y-8 pb-24">
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">NutriCloud Active</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Hello, {profile.name}</h1>
          <p className="text-slate-400 text-xs font-medium italic">"Every meal is a chance to nourish your body."</p>
        </div>
        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
           <HeartIcon className="w-8 h-8 text-rose-500" />
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-3">
            <FireIcon className="w-6 h-6 text-orange-500" />
          </div>
          <div className="text-3xl font-black text-slate-800">{todayScans.length}</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scans Today</div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3">
            <BoltIcon className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-800">{averageHealthScore}%</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vitality Score</div>
        </div>
      </div>

      {/* Hydration Widget */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 flex justify-between items-end">
          <div className="space-y-4 flex-1">
             <div className="space-y-1">
                <h3 className="text-white font-black tracking-tight text-xl">Hydration Engine</h3>
                <p className="text-slate-400 text-xs">Target: {waterGoal}ml / day</p>
             </div>
             <div className="flex items-center gap-4">
                <div className="text-4xl font-black text-white">{todayWater} <span className="text-sm text-slate-500 uppercase">ml</span></div>
                <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)] transition-all duration-1000" style={{ width: `${waterProgress}%` }} />
                </div>
             </div>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
      </div>

      {/* Recent Scans */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Recent Insights</h3>
          <button className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">History Log</button>
        </div>
        <div className="space-y-3">
          {scanHistory.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-10 rounded-[2.5rem] text-center">
              <CloudIcon className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">Waiting for your first scan...</p>
            </div>
          ) : (
            scanHistory.slice(0, 3).map(scan => (
              <div key={scan.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group active:scale-95 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    scan.rating === 'healthy' ? 'bg-emerald-50 text-emerald-600' :
                    scan.rating === 'moderate' ? 'bg-orange-50 text-orange-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {scan.rating === 'healthy' ? <CheckBadgeIcon className="w-7 h-7" /> : <BoltIcon className="w-7 h-7" />}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 leading-tight">{scan.name}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(scan.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-slate-800">{scan.healthScore}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
