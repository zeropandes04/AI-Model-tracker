import { useState, useEffect, useCallback } from 'react';
import { Model } from '../types';
import { seedModels } from '../lib/seedData';

const STORAGE_KEY = 'ai-tracker-models';

export function useModels() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setModels(JSON.parse(stored));
    } else {
      // Initialize with seed data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedModels));
      setModels(seedModels);
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever models change
  const saveModels = useCallback((newModels: Model[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newModels));
    setModels(newModels);
  }, []);

  const addModel = useCallback((model: Omit<Model, 'id'>) => {
    const newModel: Model = {
      ...model,
      id: crypto.randomUUID(),
    };
    saveModels([...models, newModel]);
    return newModel;
  }, [models, saveModels]);

  const updateModel = useCallback((id: string, updates: Partial<Model>) => {
    saveModels(models.map(m => m.id === id ? { ...m, ...updates } : m));
  }, [models, saveModels]);

  const deleteModel = useCallback((id: string) => {
    saveModels(models.filter(m => m.id !== id));
  }, [models, saveModels]);

  const getModel = useCallback((id: string) => {
    return models.find(m => m.id === id);
  }, [models]);

  return {
    models,
    loading,
    addModel,
    updateModel,
    deleteModel,
    getModel,
  };
}
