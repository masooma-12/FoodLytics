
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { 
  CameraIcon, 
  ChatBubbleLeftRightIcon, 
  UserCircleIcon, 
  ChartBarIcon, 
  BeakerIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import Dietician from './components/Dietician';
import Hydration from './components/Hydration';
import Journal from './components/Journal';
import Profile from './components/Profile';
import { UserProfile, FoodAnalysis, HydrationLog, JournalEntry } from './types';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nutriscan_profile');
    return saved ? JSON.parse(saved) : {
      name: 'User',
      age: 25,
      weight: 70,
      height: 175,
      lifestyle: 'moderate',
      goals: 'health-focus'
    };
  });

  const [scanHistory, setScanHistory] = useState<FoodAnalysis[]>(() => {
    const saved = localStorage.getItem('nutriscan_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [hydrationLogs, setHydrationLogs] = useState<HydrationLog[]>(() => {
    const saved = localStorage.getItem('nutriscan_hydration');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('nutriscan_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('nutriscan_history', JSON.stringify(scanHistory));
  }, [scanHistory]);

  useEffect(() => {
    localStorage.setItem('nutriscan_hydration', JSON.stringify(hydrationLogs));
  }, [hydrationLogs]);

  const addScan = (analysis: FoodAnalysis) => {
    setScanHistory(prev => [analysis, ...prev]);
  };

  const addHydration = (amount: number) => {
    setHydrationLogs(prev => [...prev, { timestamp: Date.now(), amount }]);
  };

  return (
    <Router>
      <div className="flex flex-col h-screen max-w-lg mx-auto bg-white shadow-xl overflow-hidden relative">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-20 gradient-bg">
          <Routes>
            <Route path="/" element={<Dashboard scanHistory={scanHistory} hydrationLogs={hydrationLogs} profile={profile} />} />
            <Route path="/scan" element={<Scanner profile={profile} onAnalysisComplete={addScan} />} />
            <Route path="/dietician" element={<Dietician profile={profile} />} />
            <Route path="/hydration" element={<Hydration logs={hydrationLogs} onAdd={addHydration} />} />
            <Route path="/journal" element={<Journal history={scanHistory} />} />
            <Route path="/profile" element={<Profile profile={profile} setProfile={setProfile} />} />
          </Routes>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/80 backdrop-blur-md border-t border-slate-200 py-3 px-6 flex justify-between items-center z-50">
          <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
            <ChartBarIcon className="w-6 h-6" />
            <span className="text-[10px] font-medium">Dashboard</span>
          </NavLink>
          <NavLink to="/hydration" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
            <BeakerIcon className="w-6 h-6" />
            <span className="text-[10px] font-medium">Hydrate</span>
          </NavLink>
          <NavLink to="/scan" className="relative -top-6 bg-emerald-500 p-4 rounded-full shadow-lg shadow-emerald-200 text-white transition-transform active:scale-95">
            <CameraIcon className="w-8 h-8" />
          </NavLink>
          <NavLink to="/dietician" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
            <span className="text-[10px] font-medium">Dietician</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
            <UserCircleIcon className="w-6 h-6" />
            <span className="text-[10px] font-medium">Profile</span>
          </NavLink>
        </nav>
      </div>
    </Router>
  );
};

export default App;
