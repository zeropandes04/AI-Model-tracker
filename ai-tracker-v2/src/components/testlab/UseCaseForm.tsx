import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { UseCase } from '../../types';

interface UseCaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; prompt: string; evaluationCriteria: string }) => void;
  onDelete?: () => void;
  existingUseCase?: UseCase | null;
}

export function UseCaseForm({
  isOpen,
  onClose,
  onSave,
  onDelete,
  existingUseCase,
}: UseCaseFormProps) {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [evaluationCriteria, setEvaluationCriteria] = useState('');

  useEffect(() => {
    if (existingUseCase) {
      setName(existingUseCase.name);
      setPrompt(existingUseCase.prompt);
      setEvaluationCriteria(existingUseCase.evaluationCriteria);
    } else {
      setName('');
      setPrompt('');
      setEvaluationCriteria('');
    }
  }, [existingUseCase, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !prompt.trim()) return;

    onSave({
      name: name.trim(),
      prompt: prompt.trim(),
      evaluationCriteria: evaluationCriteria.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingUseCase ? 'Edit Use Case' : 'Add Use Case'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Number guessing game"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="The exact prompt you'll give to the AI models..."
            rows={6}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
          />
        </div>

        {/* Evaluation Criteria */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Evaluation Criteria
          </label>
          <textarea
            value={evaluationCriteria}
            onChange={(e) => setEvaluationCriteria(e.target.value)}
            placeholder="How will you judge the responses? What makes a good answer?"
            rows={3}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-2">
          <div>
            {existingUseCase && onDelete && (
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
              disabled={!name.trim() || !prompt.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
            >
              {existingUseCase ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
