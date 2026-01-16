import { useState, useEffect, useCallback } from 'react';
import { Score } from '../types';
import { calculateFinalScore } from '../lib/calculations';

const STORAGE_KEY = 'ai-tracker-scores';

export function useScores() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setScores(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  // Save to localStorage
  const saveScores = useCallback((newScores: Score[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newScores));
    setScores(newScores);
  }, []);

  const addScore = useCallback((score: Omit<Score, 'id' | 'finalScore' | 'testedAt'>) => {
    const newScore: Score = {
      ...score,
      id: crypto.randomUUID(),
      finalScore: calculateFinalScore(score.dimensionScores),
      testedAt: new Date().toISOString(),
    };
    saveScores([...scores, newScore]);
    return newScore;
  }, [scores, saveScores]);

  const updateScore = useCallback((id: string, updates: Partial<Omit<Score, 'finalScore'>>) => {
    saveScores(scores.map(s => {
      if (s.id !== id) return s;
      const updated = { ...s, ...updates };
      // Recalculate final score if dimension scores changed
      if (updates.dimensionScores) {
        updated.finalScore = calculateFinalScore(updates.dimensionScores);
      }
      return updated;
    }));
  }, [scores, saveScores]);

  const deleteScore = useCallback((id: string) => {
    saveScores(scores.filter(s => s.id !== id));
  }, [scores, saveScores]);

  const getScore = useCallback((id: string) => {
    return scores.find(s => s.id === id);
  }, [scores]);

  const getScoresByModel = useCallback((modelId: string) => {
    return scores.filter(s => s.modelId === modelId);
  }, [scores]);

  const getScoresByUseCase = useCallback((useCaseId: string) => {
    return scores.filter(s => s.useCaseId === useCaseId);
  }, [scores]);

  const getScoreByModelAndUseCase = useCallback((modelId: string, useCaseId: string) => {
    return scores.find(s => s.modelId === modelId && s.useCaseId === useCaseId);
  }, [scores]);

  // Delete all scores for a model (useful when deleting a model)
  const deleteScoresByModel = useCallback((modelId: string) => {
    saveScores(scores.filter(s => s.modelId !== modelId));
  }, [scores, saveScores]);

  // Delete all scores for a use case (useful when deleting a use case)
  const deleteScoresByUseCase = useCallback((useCaseId: string) => {
    saveScores(scores.filter(s => s.useCaseId !== useCaseId));
  }, [scores, saveScores]);

  return {
    scores,
    loading,
    addScore,
    updateScore,
    deleteScore,
    getScore,
    getScoresByModel,
    getScoresByUseCase,
    getScoreByModelAndUseCase,
    deleteScoresByModel,
    deleteScoresByUseCase,
  };
}
