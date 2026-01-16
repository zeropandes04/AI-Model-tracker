import { Modal } from '../ui/Modal';
import { Model, Category, UseCase, Score } from '../../types';
import { getModelCategoryScore, getModelUseCaseCount } from '../../lib/calculations';

interface ModelProfileProps {
  model: Model | null;
  categories: Category[];
  useCases: UseCase[];
  scores: Score[];
  onClose: () => void;
}

export function ModelProfile({ model, categories, useCases, scores, onClose }: ModelProfileProps) {
  if (!model) return null;

  const categoryData = categories.map((category) => {
    const score = getModelCategoryScore(model.id, category.id, scores, useCases);
    const useCaseCount = getModelUseCaseCount(model.id, category.id, scores, useCases);
    const totalUseCases = useCases.filter((uc) => uc.categoryId === category.id).length;

    return {
      category,
      score,
      useCaseCount,
      totalUseCases,
    };
  });

  const maxScore = Math.max(...categoryData.map((d) => d.score ?? 0), 10);

  return (
    <Modal isOpen={!!model} onClose={onClose} title={model.name} size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-slate-400">{model.version}</p>
            {model.notes && (
              <p className="text-sm text-slate-500 mt-1">{model.notes}</p>
            )}
          </div>
        </div>

        {/* Score Chart */}
        <div>
          <h4 className="text-sm font-medium text-slate-400 mb-3">Scores by Category</h4>
          <div className="space-y-3">
            {categoryData.map(({ category, score, useCaseCount, totalUseCases }) => (
              <div key={category.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">{category.name}</span>
                  <span className={score !== null ? 'text-slate-200' : 'text-slate-500'}>
                    {score !== null ? score.toFixed(1) : 'N/A'}
                    <span className="text-slate-500 ml-2">
                      ({useCaseCount}/{totalUseCases} tested)
                    </span>
                  </span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  {score !== null && (
                    <div
                      className={`h-full rounded-full transition-all ${
                        score >= 8
                          ? 'bg-green-500'
                          : score >= 6
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${(score / maxScore) * 100}%` }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Use Case Breakdown */}
        <div>
          <h4 className="text-sm font-medium text-slate-400 mb-3">Use Case Breakdown</h4>
          <div className="bg-slate-900 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-4 py-2 text-slate-400 font-medium">Category</th>
                  <th className="text-left px-4 py-2 text-slate-400 font-medium">Use Case</th>
                  <th className="text-right px-4 py-2 text-slate-400 font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => {
                  const categoryUseCases = useCases.filter(
                    (uc) => uc.categoryId === category.id
                  );
                  return categoryUseCases.map((useCase, idx) => {
                    const score = scores.find(
                      (s) => s.modelId === model.id && s.useCaseId === useCase.id
                    );
                    return (
                      <tr
                        key={useCase.id}
                        className="border-b border-slate-700/50 hover:bg-slate-800/50"
                      >
                        <td className="px-4 py-2 text-slate-400">
                          {idx === 0 ? category.name : ''}
                        </td>
                        <td className="px-4 py-2 text-slate-300">{useCase.name}</td>
                        <td className="px-4 py-2 text-right">
                          {score ? (
                            <span
                              className={
                                score.finalScore >= 8
                                  ? 'text-green-400'
                                  : score.finalScore >= 6
                                  ? 'text-yellow-400'
                                  : 'text-red-400'
                              }
                            >
                              {score.finalScore.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
}
