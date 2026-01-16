import { UseCase, Model, Score, Category } from '../../types';
import { CopyButton } from '../ui/CopyButton';
import { StarRating } from '../ui/StarRating';

interface UseCaseCardProps {
  useCase: UseCase;
  category: Category;
  models: Model[];
  scores: Score[];
  onEdit: () => void;
  onDelete: () => void;
  onAddScore: () => void;
  onEditScore: (scoreId: string) => void;
}

export function UseCaseCard({
  useCase,
  category,
  models,
  scores,
  onEdit,
  onDelete,
  onAddScore,
  onEditScore,
}: UseCaseCardProps) {
  const useCaseScores = scores.filter((s) => s.useCaseId === useCase.id);

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700 bg-slate-800/80">
        <h3 className="font-medium text-slate-100">Use Case: {useCase.name}</h3>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-slate-700 rounded transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Prompt */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-400">Prompt:</span>
            <CopyButton text={useCase.prompt} />
          </div>
          <div className="bg-slate-900 rounded-lg p-3 font-mono text-sm text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
            {useCase.prompt}
          </div>
        </div>

        {/* Evaluation Criteria */}
        <div>
          <span className="text-sm font-medium text-slate-400">Evaluation Criteria:</span>
          <p className="text-sm text-slate-300 mt-1">{useCase.evaluationCriteria}</p>
        </div>

        {/* Scores */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-400">Scores:</span>
            <button
              onClick={onAddScore}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Score
            </button>
          </div>

          {useCaseScores.length > 0 ? (
            <div className="bg-slate-900 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left px-4 py-2 text-slate-400 font-medium">Model</th>
                    {category.dimensions.map((dim) => (
                      <th key={dim} className="text-center px-2 py-2 text-slate-400 font-medium text-xs">
                        {dim}
                      </th>
                    ))}
                    <th className="text-center px-4 py-2 text-slate-400 font-medium">Score</th>
                    <th className="w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {useCaseScores.map((score) => {
                    const model = models.find((m) => m.id === score.modelId);
                    return (
                      <tr
                        key={score.id}
                        className="border-b border-slate-700/50 hover:bg-slate-800/50"
                      >
                        <td className="px-4 py-2 text-slate-200">{model?.name || 'Unknown'}</td>
                        {category.dimensions.map((dim) => (
                          <td key={dim} className="px-2 py-2">
                            <div className="flex justify-center">
                              <StarRating
                                value={score.dimensionScores[dim] || 0}
                                readonly
                                size="sm"
                              />
                            </div>
                          </td>
                        ))}
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`font-medium ${
                              score.finalScore >= 8
                                ? 'text-green-400'
                                : score.finalScore >= 6
                                ? 'text-yellow-400'
                                : 'text-red-400'
                            }`}
                          >
                            {score.finalScore.toFixed(1)}/10
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <button
                            onClick={() => onEditScore(score.id)}
                            className="text-xs text-slate-400 hover:text-slate-200"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-lg p-4 text-center text-sm text-slate-500">
              No scores recorded yet. Click "Add Score" to rate a model.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
