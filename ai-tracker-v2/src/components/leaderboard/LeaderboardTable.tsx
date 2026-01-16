import { useState } from 'react';
import { CategoryRanking, Model, UseCase, Score } from '../../types';

interface LeaderboardTableProps {
  rankings: CategoryRanking[];
  useCases: UseCase[];
  scores: Score[];
  onModelClick: (model: Model) => void;
}

export function LeaderboardTable({
  rankings,
  useCases,
  scores,
  onModelClick,
}: LeaderboardTableProps) {
  const [showNoScores, setShowNoScores] = useState(false);
  const [expandedCell, setExpandedCell] = useState<string | null>(null);

  const filteredRankings = showNoScores
    ? rankings
    : rankings.filter((r) => r.rankings.length > 0);

  const getMedalEmoji = (index: number) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return '';
    }
  };

  const handleCellClick = (categoryId: string, modelId: string) => {
    const key = `${categoryId}-${modelId}`;
    setExpandedCell(expandedCell === key ? null : key);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={showNoScores}
            onChange={(e) => setShowNoScores(e.target.checked)}
            className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
          />
          Show categories with no scores
        </label>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left px-4 py-3 text-slate-400 font-medium bg-slate-800/80 sticky left-0">
                  Category
                </th>
                <th className="text-center px-4 py-3 text-slate-400 font-medium">🥇 1st</th>
                <th className="text-center px-4 py-3 text-slate-400 font-medium">🥈 2nd</th>
                <th className="text-center px-4 py-3 text-slate-400 font-medium">🥉 3rd</th>
                <th className="text-center px-4 py-3 text-slate-400 font-medium">Others</th>
              </tr>
            </thead>
            <tbody>
              {filteredRankings.map((ranking) => (
                <tr
                  key={ranking.categoryId}
                  className="border-b border-slate-700/50 hover:bg-slate-700/30"
                >
                  <td className="px-4 py-3 text-slate-200 font-medium bg-slate-800/80 sticky left-0">
                    {ranking.categoryName}
                  </td>
                  {[0, 1, 2].map((index) => {
                    const item = ranking.rankings[index];
                    const cellKey = `${ranking.categoryId}-${item?.model.id}`;
                    const isExpanded = expandedCell === cellKey;

                    return (
                      <td key={index} className="px-4 py-3 text-center relative">
                        {item ? (
                          <div>
                            <button
                              onClick={() => handleCellClick(ranking.categoryId, item.model.id)}
                              className="hover:underline text-slate-200"
                            >
                              {item.model.name}
                              <span
                                className={`ml-2 ${
                                  item.score >= 8
                                    ? 'text-green-400'
                                    : item.score >= 6
                                    ? 'text-yellow-400'
                                    : 'text-red-400'
                                }`}
                              >
                                ({item.score.toFixed(1)})
                              </span>
                            </button>
                            {isExpanded && (
                              <UseCasePopover
                                categoryId={ranking.categoryId}
                                modelId={item.model.id}
                                useCases={useCases}
                                scores={scores}
                                onClose={() => setExpandedCell(null)}
                                onModelClick={() => onModelClick(item.model)}
                              />
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center">
                    {ranking.rankings.length > 3 ? (
                      <span className="text-slate-500">
                        {ranking.rankings
                          .slice(3)
                          .map((r) => r.model.name)
                          .join(', ')}
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRankings.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No scores recorded yet. Head to the Test Lab to add some!
          </div>
        )}
      </div>
    </div>
  );
}

interface UseCasePopoverProps {
  categoryId: string;
  modelId: string;
  useCases: UseCase[];
  scores: Score[];
  onClose: () => void;
  onModelClick: () => void;
}

function UseCasePopover({
  categoryId,
  modelId,
  useCases,
  scores,
  onClose,
  onModelClick,
}: UseCasePopoverProps) {
  const categoryUseCases = useCases.filter((uc) => uc.categoryId === categoryId);
  const relevantScores = scores.filter(
    (s) => s.modelId === modelId && categoryUseCases.some((uc) => uc.id === s.useCaseId)
  );

  return (
    <div className="absolute z-10 top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-slate-700 rounded-lg shadow-xl border border-slate-600 p-3">
      <div className="text-left">
        <div className="text-xs text-slate-400 mb-2">Use Case Scores</div>
        <div className="space-y-1">
          {categoryUseCases.map((useCase) => {
            const score = relevantScores.find((s) => s.useCaseId === useCase.id);
            return (
              <div key={useCase.id} className="flex justify-between text-xs">
                <span className="text-slate-300 truncate mr-2">{useCase.name}</span>
                <span
                  className={
                    score
                      ? score.finalScore >= 8
                        ? 'text-green-400'
                        : score.finalScore >= 6
                        ? 'text-yellow-400'
                        : 'text-red-400'
                      : 'text-slate-500'
                  }
                >
                  {score ? score.finalScore.toFixed(1) : '-'}
                </span>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => {
            onClose();
            onModelClick();
          }}
          className="w-full mt-3 text-xs text-blue-400 hover:text-blue-300"
        >
          View full profile →
        </button>
      </div>
    </div>
  );
}
