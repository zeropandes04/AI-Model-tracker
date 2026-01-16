import { useState, useEffect, useCallback } from 'react';
import { Category, UseCase } from '../types';
import { seedCategories, seedUseCases } from '../lib/seedData';

const CATEGORIES_KEY = 'ai-tracker-categories';
const USECASES_KEY = 'ai-tracker-usecases';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const storedCategories = localStorage.getItem(CATEGORIES_KEY);
    const storedUseCases = localStorage.getItem(USECASES_KEY);

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(seedCategories));
      setCategories(seedCategories);
    }

    if (storedUseCases) {
      setUseCases(JSON.parse(storedUseCases));
    } else {
      localStorage.setItem(USECASES_KEY, JSON.stringify(seedUseCases));
      setUseCases(seedUseCases);
    }

    setLoading(false);
  }, []);

  // Categories
  const saveCategories = useCallback((newCategories: Category[]) => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(newCategories));
    setCategories(newCategories);
  }, []);

  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
    };
    saveCategories([...categories, newCategory]);
    return newCategory;
  }, [categories, saveCategories]);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    saveCategories(categories.map(c => c.id === id ? { ...c, ...updates } : c));
  }, [categories, saveCategories]);

  const deleteCategory = useCallback((id: string) => {
    saveCategories(categories.filter(c => c.id !== id));
    // Also delete associated use cases
    const newUseCases = useCases.filter(uc => uc.categoryId !== id);
    localStorage.setItem(USECASES_KEY, JSON.stringify(newUseCases));
    setUseCases(newUseCases);
  }, [categories, useCases, saveCategories]);

  const getCategory = useCallback((id: string) => {
    return categories.find(c => c.id === id);
  }, [categories]);

  // Use Cases
  const saveUseCases = useCallback((newUseCases: UseCase[]) => {
    localStorage.setItem(USECASES_KEY, JSON.stringify(newUseCases));
    setUseCases(newUseCases);
  }, []);

  const addUseCase = useCallback((useCase: Omit<UseCase, 'id'>) => {
    const newUseCase: UseCase = {
      ...useCase,
      id: crypto.randomUUID(),
    };
    saveUseCases([...useCases, newUseCase]);
    return newUseCase;
  }, [useCases, saveUseCases]);

  const updateUseCase = useCallback((id: string, updates: Partial<UseCase>) => {
    saveUseCases(useCases.map(uc => uc.id === id ? { ...uc, ...updates } : uc));
  }, [useCases, saveUseCases]);

  const deleteUseCase = useCallback((id: string) => {
    saveUseCases(useCases.filter(uc => uc.id !== id));
  }, [useCases, saveUseCases]);

  const getUseCase = useCallback((id: string) => {
    return useCases.find(uc => uc.id === id);
  }, [useCases]);

  const getUseCasesByCategory = useCallback((categoryId: string) => {
    return useCases.filter(uc => uc.categoryId === categoryId);
  }, [useCases]);

  return {
    categories,
    useCases,
    loading,
    // Categories
    addCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    // Use Cases
    addUseCase,
    updateUseCase,
    deleteUseCase,
    getUseCase,
    getUseCasesByCategory,
  };
}
