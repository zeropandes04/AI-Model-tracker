import { useState } from 'react';
import { Model, Category, UseCase, Score } from '../types';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';
import { ModelProfile } from '../components/models/ModelProfile';
import { getCategoryRankings } from '../lib/calculations';

interface LeaderboardPageProps {
  models: Model[];
  categories: Category[];
  useCases: UseCase[];
  scores: Score[];
}

export function LeaderboardPage({
  models,
  categories,
  useCases,
  scores,
}: LeaderboardPageProps) {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  const rankings = getCategoryRankings(categories, models, scores, useCases);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Leaderboard</h1>
        <p className="text-slate-400 mt-1">See which models lead in each category</p>
      </div>

      <LeaderboardTable
        rankings={rankings}
        useCases={useCases}
        scores={scores}
        onModelClick={setSelectedModel}
      />

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
