
import React from 'react';
import { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, setProfile }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: isNaN(Number(value)) ? value : Number(value)
    });
  };

  return (
    <div className="p-6 space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Your Health Profile</h1>
        <p className="text-slate-500">Personalized AI analysis starts here.</p>
      </header>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
          <input 
            type="text" 
            name="name" 
            value={profile.name} 
            onChange={handleChange}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Age</label>
            <input 
              type="number" 
              name="age" 
              value={profile.age} 
              onChange={handleChange}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Weight (kg)</label>
            <input 
              type="number" 
              name="weight" 
              value={profile.weight} 
              onChange={handleChange}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Lifestyle</label>
          <select 
            name="lifestyle" 
            value={profile.lifestyle} 
            onChange={handleChange}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="sedentary">Sedentary (Office worker)</option>
            <option value="moderate">Moderate Activity (Walking/Light exercise)</option>
            <option value="active">Active (Frequent exercise)</option>
            <option value="athlete">Athlete (Daily high-intensity)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Primary Goal</label>
          <select 
            name="goals" 
            value={profile.goals} 
            onChange={handleChange}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="weight-loss">Weight Loss</option>
            <option value="maintenance">Weight Maintenance</option>
            <option value="muscle-gain">Muscle Gain</option>
            <option value="health-focus">General Health & Longevity</option>
          </select>
        </div>
      </div>

      <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 text-center">
        <p className="text-emerald-700 text-sm">
          This data is saved locally on your device and used only to personalize your food analysis and AI dietician responses.
        </p>
      </div>
    </div>
  );
};

export default Profile;
