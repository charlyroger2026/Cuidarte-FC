export type RiskLevel = 'Bajo' | 'Moderado' | 'Alto' | 'Muy Alto';

export interface Patient {
  id: string;
  dni: string;
  name: string;
  age: number;
  lastEvaluation: string;
  riskScore: number;
  riskLevel: RiskLevel;
  tugTime: number;
  tugTrend: number;
  adherence: number;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'Fuerza' | 'Equilibrio';
  level: string;
  series: number;
  reps: number;
  imageUrl: string;
  videoUrl?: string;
  locked?: boolean;
}
