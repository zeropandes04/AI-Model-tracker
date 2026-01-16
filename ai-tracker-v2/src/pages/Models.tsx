import { useState } from 'react';
import { Model, Category, UseCase, Score } from '../types';
import { ModelCard } from '../components/models/ModelCard';
import { ModelProfile } from '../components/models/ModelProfile';
import { getModelStats } from '../lib/calculations';

interface ModelsPageProps {
  models: Model[];
  categories: Category[];
  useCases: UseCase[];
  scores: Score[];
}

export function ModelsPage({ models, categories, useCases, scores }: ModelsPageProps) {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  const modelStats = models.map((model) =>
    getModelStats(model, scores, useCases, categories)
  );

  // Sort by overall score descending
  const sortedStats = [...modelStats].sort((a, b) => b.overallScore - a.overallScore);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Models</h1>
        <p className="text-slate-400 mt-1">Compare AI model performance across all categories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedStats.map((stats) => (
          <ModelCard
            key={stats.model.id}
            stats={stats}
            onClick={() => setSelectedModel(stats.model)}
          />
        ))}
      </div>

      {models.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No models configured. Add some models to get started.
        </div>
      )}

      <ModelProfile
        model={selectedModel}
        categories={categories}
        useCases={useCases}
        scores={scores}
        onClose={() => setSelectedModel(null)}
      />
    </div>
  );
}
