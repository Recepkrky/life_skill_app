export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  icon: any;
  color: string;
  completed: boolean;
  steps?: ScenarioStep[];
}

export interface ScenarioStep {
  id: string;
  question: string;
  imageUrl?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback?: string;
  }[];
  correctOptionId: string;
  nextStepId?: string;
  previousStepId?: string;
}

export interface SimpleScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  icon: any;
  color: string;
  steps: ScenarioStep[];
  completed: boolean;
  category: 'Günlük' | 'Ulaşım' | 'Sağlık' | 'Teknoloji' | 'Eğlence' | 'Eğitim';
  maxScore: number;
}

export interface Message {
  id: number;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  earned: boolean;
}

export interface UserProgress {
  totalCompleted: number;
  successRate: number;
  totalTime: string;
  totalPoints: number;
  currentStreak: number;
}