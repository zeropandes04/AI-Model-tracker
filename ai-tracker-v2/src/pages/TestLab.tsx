import { useState } from 'react';
import { Model, Category, UseCase, Score } from '../types';
import { CategorySidebar } from '../components/testlab/CategorySidebar';
import { UseCaseCard } from '../components/testlab/UseCaseCard';
import { CategoryForm } from '../components/testlab/CategoryForm';
import { UseCaseForm } from '../components/testlab/UseCaseForm';
import { ScoreForm } from '../components/testlab/ScoreForm';
import { useToast } from '../components/ui/Toast';

interface TestLabPageProps {
  models: Model[];
  categories: Category[];
  useCases: UseCase[];
  scores: Score[];
  onAddCategory: (data: { name: string; description: string; dimensions: string[] }) => void;
  onUpdateCategory: (id: string, data: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
  onAddUseCase: (data: { categoryId: string; name: string; prompt: string; evaluationCriteria: string }) => void;
  onUpdateUseCase: (id: string, data: Partial<UseCase>) => void;
  onDeleteUseCase: (id: string) => void;
  onAddScore: (data: { modelId: string; useCaseId: string; dimensionScores: Record<string, number>; notes: string }) => void;
  onUpdateScore: (id: string, data: Partial<Score>) => void;
  onDeleteScore: (id: string) => void;
}

export function TestLabPage({
  models,
  categories,
  useCases,
  scores,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddUseCase,
  onUpdateUseCase,
  onDeleteUseCase,
  onAddScore,
  onUpdateScore,
  onDeleteScore,
}: TestLabPageProps) {
  const { showToast } = useToast();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    categories[0]?.id || null
  );

  // Modal states
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [useCaseFormOpen, setUseCaseFormOpen] = useState(false);
  const [editingUseCase, setEditingUseCase] = useState<UseCase | null>(null);
  const [scoreFormOpen, setScoreFormOpen] = useState(false);
  const [editingScore, setEditingScore] = useState<Score | null>(null);
  const [scoreUseCaseId, setScoreUseCaseId] = useState<string | null>(null);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const categoryUseCases = useCases.filter((uc) => uc.categoryId === selectedCategoryId);

  // Category handlers
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormOpen(true);
  };

  const handleEditCategory = () => {
    setEditingCategory(selectedCategory || null);
    setCategoryFormOpen(true);
  };

  const handleSaveCategory = (data: { name: string; description: string; dimensions: string[] }) => {
    if (editingCategory) {
      onUpdateCategory(editingCategory.id, data);
      showToast('Category updated');
    } else {
      onAddCategory(data);
      showToast('Category added');
    }
    setCategoryFormOpen(false);
  };

  const handleDeleteCategory = () => {
    if (editingCategory && confirm('Delete this category and all its use cases?')) {
      onDeleteCategory(editingCategory.id);
      setSelectedCategoryId(categories[0]?.id || null);
      setCategoryFormOpen(false);
      showToast('Category deleted');
    }
  };

  // Use Case handlers
  const handleAddUseCase = () => {
    setEditingUseCase(null);
    setUseCaseFormOpen(true);
  };

  const handleEditUseCase = (useCase: UseCase) => {
    setEditingUseCase(useCase);
    setUseCaseFormOpen(true);
  };

  const handleSaveUseCase = (data: { name: string; prompt: string; evaluationCriteria: string }) => {
    if (editingUseCase) {
      onUpdateUseCase(editingUseCase.id, data);
      showToast('Use case updated');
    } else if (selectedCategoryId) {
      onAddUseCase({ ...data, categoryId: selectedCategoryId });
      showToast('Use case added');
    }
    setUseCaseFormOpen(false);
  };

  const handleDeleteUseCase = (useCaseId: string) => {
    if (confirm('Delete this use case and all its scores?')) {
      onDeleteUseCase(useCaseId);
      setUseCaseFormOpen(false);
      showToast('Use case deleted');
    }
  };

  // Score handlers
  const handleAddScore = (useCaseId: string) => {
    setEditingScore(null);
    setScoreUseCaseId(useCaseId);
    setScoreFormOpen(true);
  };

  const handleEditScore = (scoreId: string) => {
    const score = scores.find((s) => s.id === scoreId);
    if (score) {
      setEditingScore(score);
      setScoreUseCaseId(score.useCaseId);
      setScoreFormOpen(true);
    }
  };

  const handleSaveScore = (data: { modelId: string; dimensionScores: Record<string, number>; notes: string }) => {
    if (editingScore) {
      onUpdateScore(editingScore.id, data);
      showToast('Score updated');
    } else if (scoreUseCaseId) {
      onAddScore({ ...data, useCaseId: scoreUseCaseId });
      showToast('Score added');
    }
    setScoreFormOpen(false);
  };

  const handleDeleteScore = () => {
    if (editingScore && confirm('Delete this score?')) {
      onDeleteScore(editingScore.id);
      setScoreFormOpen(false);
      showToast('Score deleted');
    }
  };

  // Get model IDs that already have scores for current use case
  const usedModelIds = scoreUseCaseId
    ? scores.filter((s) => s.useCaseId === scoreUseCaseId).map((s) => s.modelId)
    : [];

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <CategorySidebar
        categories={categories}
        selectedId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
        onAddCategory={handleAddCategory}
      />

      <div className="flex-1 overflow-y-auto p-6">
        {selectedCategory ? (
          <>
            {/* Category Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-100">{selectedCategory.name}</h1>
                <p className="text-slate-400 mt-1">{selectedCategory.description}</p>
                <div className="flex gap-2 mt-2">
                  {selectedCategory.dimensions.map((dim) => (
                    <span
                      key={dim}
                      className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded"
                    >
                      {dim}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleEditCategory}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Edit Category
                </button>
                <button
                  onClick={handleAddUseCase}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Use Case
                </button>
              </div>
            </div>

            {/* Use Cases */}
            <div className="space-y-6">
              {categoryUseCases.map((useCase) => (
                <UseCaseCard
                  key={useCase.id}
                  useCase={useCase}
                  category={selectedCategory}
                  models={models}
                  scores={scores}
                  onEdit={() => handleEditUseCase(useCase)}
                  onDelete={() => handleDeleteUseCase(useCase.id)}
                  onAddScore={() => handleAddScore(useCase.id)}
                  onEditScore={handleEditScore}
                />
              ))}

              {categoryUseCases.length === 0 && (
                <div className="text-center py-12 text-slate-500 bg-slate-800 rounded-lg border border-slate-700">
                  No use cases in this category yet.
                  <br />
                  <button
                    onClick={handleAddUseCase}
                    className="text-blue-400 hover:text-blue-300 mt-2"
                  >
                    Add your first use case
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            Select a category from the sidebar or create a new one.
          </div>
        )}
      </div>

      {/* Forms */}
      <CategoryForm
        isOpen={categoryFormOpen}
        onClose={() => setCategoryFormOpen(false)}
        onSave={handleSaveCategory}
        onDelete={editingCategory ? handleDeleteCategory : undefined}
        existingCategory={editingCategory}
      />

      <UseCaseForm
        isOpen={useCaseFormOpen}
        onClose={() => setUseCaseFormOpen(false)}
        onSave={handleSaveUseCase}
        onDelete={editingUseCase ? () => handleDeleteUseCase(editingUseCase.id) : undefined}
        existingUseCase={editingUseCase}
      />

      {selectedCategory && (
        <ScoreForm
          isOpen={scoreFormOpen}
          onClose={() => setScoreFormOpen(false)}
          onSave={handleSaveScore}
          onDelete={editingScore ? handleDeleteScore : undefined}
          models={models}
          category={selectedCategory}
          existingScore={editingScore}
          usedModelIds={usedModelIds}
        />
      )}
    </div>
  );
}
