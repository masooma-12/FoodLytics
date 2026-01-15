
export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  lifestyle: 'sedentary' | 'moderate' | 'active' | 'athlete';
  goals: 'weight-loss' | 'maintenance' | 'muscle-gain' | 'health-focus';
}

export interface FoodAnalysis {
  id: string;
  timestamp: number;
  name: string;
  healthScore: number; // 0-100
  rating: 'healthy' | 'moderate' | 'unhealthy';
  metrics: {
    sugar: number;
    fat: number;
    salt: number;
    calories: number;
    protein: number;
    fiber: number;
  };
  summary: string;
  recommendation: string;
}

export interface HydrationLog {
  timestamp: number;
  amount: number; // in ml
}

export interface JournalEntry {
  id: string;
  timestamp: number;
  content: string;
  mood: 'great' | 'good' | 'neutral' | 'tired' | 'stressed';
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
