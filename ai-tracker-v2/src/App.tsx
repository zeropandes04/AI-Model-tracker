import { useState } from 'react';
import { TabType } from './types';
import { useModels } from './hooks/useModels';
import { useCategories } from './hooks/useCategories';
import { useScores } from './hooks/useScores';
import { ToastProvider } from './components/ui/Toast';
import { ModelsPage } from './pages/Models';
import { LeaderboardPage } from './pages/Leaderboard';
import { TestLabPage } from './pages/TestLab';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('models');

  const { models, loading: modelsLoading } = useModels();
  const {
    categories,
    useCases,
    loading: categoriesLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    addUseCase,
    updateUseCase,
    deleteUseCase,
  } = useCategories();
  const {
    scores,
    loading: scoresLoading,
    addScore,
    updateScore,
    deleteScore,
    deleteScoresByUseCase,
  } = useScores();

  const loading = modelsLoading || categoriesLoading || scoresLoading;

  // Handle use case deletion (also delete associated scores)
  const handleDeleteUseCase = (id: string) => {
    deleteScoresByUseCase(id);
    deleteUseCase(id);
  };

  // Handle category deletion (scores for use cases will be handled by cascade in useCategories)
  const handleDeleteCategory = (id: string) => {
    const categoryUseCases = useCases.filter((uc) => uc.categoryId === id);
    categoryUseCases.forEach((uc) => deleteScoresByUseCase(uc.id));
    deleteCategory(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'models', label: 'Models' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'testlab', label: 'Test Lab' },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-lg font-semibold text-slate-100">
                AI Model Tracker
              </span>
            </div>

            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-slate-700 text-slate-100'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto">
        {activeTab === 'models' && (
          <ModelsPage
            models={models}
            categories={categories}
            useCases={useCases}
            scores={scores}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardPage
            models={models}
            categories={categories}
            useCases={useCases}
            scores={scores}
          />
        )}

        {activeTab === 'testlab' && (
          <TestLabPage
            models={models}
            categories={categories}
            useCases={useCases}
            scores={scores}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddUseCase={addUseCase}
            onUpdateUseCase={updateUseCase}
            onDeleteUseCase={handleDeleteUseCase}
            onAddScore={addScore}
            onUpdateScore={updateScore}
            onDeleteScore={deleteScore}
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
