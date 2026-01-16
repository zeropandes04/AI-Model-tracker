import { ModelStats } from '../../types';

interface ModelCardProps {
  stats: ModelStats;
  onClick: () => void;
}

export function ModelCard({ stats, onClick }: ModelCardProps) {
  const { model, overallScore, strengths, weakness, useCasesTested } = stats;

  const scoreColor = overallScore >= 8
    ? 'text-green-400'
    : overallScore >= 6
    ? 'text-yellow-400'
    : 'text-red-400';

  return (
    <div
      onClick={onClick}
      className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-slate-500 cursor-pointer transition-all hover:shadow-lg hover:shadow-slate-900/50"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{model.name}</h3>
          <p className="text-sm text-slate-400">{model.version}</p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${scoreColor}`}>
            {overallScore > 0 ? overallScore.toFixed(1) : '-'}
          </div>
          <div className="text-xs text-slate-500">
            {useCasesTested > 0 ? `${useCasesTested} tests` : 'No tests'}
          </div>
        </div>
      </div>

      {strengths.length > 0 && (
        <div className="mb-2">
          <div className="flex flex-wrap gap-1">
            {strengths.map((strength) => (
              <span
                key={strength}
                className="px-2 py-0.5 text-xs bg-green-900/40 text-green-400 rounded-full"
              >
                {strength}
              </span>
            ))}
          </div>
        </div>
      )}

      {weakness && weakness !== strengths[0] && (
        <div className="text-xs text-slate-500">
          Weakest: {weakness}
        </div>
      )}
    </div>
  );
}
