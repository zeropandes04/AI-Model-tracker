export interface Model {
  id: string;
  name: string;
  version: string;
  notes: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  dimensions: string[];
}

export interface UseCase {
  id: string;
  categoryId: string;
  name: string;
  prompt: string;
  evaluationCriteria: string;
}

export interface Score {
  id: string;
  modelId: string;
  useCaseId: string;
  dimensionScores: Record<string, number>; // dimension name -> 1-5 rating
  finalScore: number; // calculated average scaled to 10
  notes: string;
  testedAt: string;
}

export interface ModelStats {
  model: Model;
  overallScore: number;
  categoryScores: Record<string, number>;
  strengths: string[];
  weakness: string | null;
  useCasesTested: number;
}

export interface CategoryRanking {
  categoryId: string;
  categoryName: string;
  rankings: Array<{
    model: Model;
    score: number;
    useCaseCount: number;
  }>;
}

export type TabType = 'models' | 'leaderboard' | 'testlab';
