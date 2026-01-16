import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { MultiStarRating } from '../ui/StarRating';
import { Model, Category, Score } from '../../types';
import { calculateFinalScore } from '../../lib/calculations';

interface ScoreFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    modelId: string;
    dimensionScores: Record<string, number>;
    notes: string;
  }) => void;
  onDelete?: () => void;
  models: Model[];
  category: Category;
  existingScore?: Score | null;
  usedModelIds?: string[];
}

export function ScoreForm({
  isOpen,
  onClose,
  onSave,
  onDelete,
  models,
  category,
  existingScore,
  usedModelIds = [],
}: ScoreFormProps) {
  const [modelId, setModelId] = useState('');
  const [dimensionScores, setDimensionScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (existingScore) {
      setModelId(existingScore.modelId);
      setDimensionScores(existingScore.dimensionScores);
      setNotes(existingScore.notes);
    } else {
      setModelId('');
      setDimensionScores({});
      setNotes('');
    }
  }, [existingScore, isOpen]);

  const handleDimensionChange = (dimension: string, value: number) => {
    setDimensionScores((prev) => ({ ...prev, [dimension]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelId) return;

    onSave({
      modelId,
      dimensionScores,
      notes,
    });
  };

  const availableModels = existingScore
    ? models
    : models.filter((m) => !usedModelIds.includes(m.id));

  const previewScore = calculateFinalScore(dimensionScores);
  const allDimensionsFilled = category.dimensions.every(
    (dim) => dimensionScores[dim] && dimensionScores[dim] > 0
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingScore ? 'Edit Score' : 'Add Score'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Model Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Model
          </label>
          <select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            disabled={!!existingScore}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Select a model...</option>
            {availableModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.version})
              </option>
            ))}
          </select>
          {availableModels.length === 0 && !existingScore && (
            <p className="text-xs text-yellow-500 mt-1">
              All models have been scored for this use case.
            </p>
          )}
        </div>

        {/* Dimension Ratings */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Ratings by Dimension
          </label>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <MultiStarRating
              dimensions={category.dimensions}
              values={dimensionScores}
              onChange={handleDimensionChange}
            />
          </div>
        </div>

        {/* Preview Score */}
        <div className="flex items-center justify-between py-3 px-4 bg-slate-700/30 rounded-lg">
          <span className="text-sm text-slate-400">Final Score:</span>
          <span
            className={`text-2xl font-bold ${
              previewScore >= 8
                ? 'text-green-400'
                : previewScore >= 6
                ? 'text-yellow-400'
                : previewScore > 0
                ? 'text-red-400'
                : 'text-slate-500'
            }`}
          >
            {allDimensionsFilled ? `${previewScore.toFixed(1)}/10` : '-/10'}
          </span>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any observations or notes about this test..."
            rows={3}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-2">
          <div>
            {existingScore && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!modelId || !allDimensionsFilled}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
            >
              {existingScore ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
