import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Category } from '../../types';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string; dimensions: string[] }) => void;
  onDelete?: () => void;
  existingCategory?: Category | null;
}

export function CategoryForm({
  isOpen,
  onClose,
  onSave,
  onDelete,
  existingCategory,
}: CategoryFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState<string[]>([]);
  const [newDimension, setNewDimension] = useState('');

  useEffect(() => {
    if (existingCategory) {
      setName(existingCategory.name);
      setDescription(existingCategory.description);
      setDimensions(existingCategory.dimensions);
    } else {
      setName('');
      setDescription('');
      setDimensions([]);
    }
    setNewDimension('');
  }, [existingCategory, isOpen]);

  const handleAddDimension = () => {
    const trimmed = newDimension.trim();
    if (trimmed && !dimensions.includes(trimmed)) {
      setDimensions([...dimensions, trimmed]);
      setNewDimension('');
    }
  };

  const handleRemoveDimension = (dim: string) => {
    setDimensions(dimensions.filter((d) => d !== dim));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddDimension();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || dimensions.length === 0) return;

    onSave({
      name: name.trim(),
      description: description.trim(),
      dimensions,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingCategory ? 'Edit Category' : 'Add Category'}
      size="md"
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
            placeholder="e.g., Coding"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this category test?"
            rows={2}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Dimensions */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Dimensions
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newDimension}
              onChange={(e) => setNewDimension(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Accuracy"
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddDimension}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {dimensions.map((dim) => (
              <span
                key={dim}
                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm"
              >
                {dim}
                <button
                  type="button"
                  onClick={() => handleRemoveDimension(dim)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
          {dimensions.length === 0 && (
            <p className="text-xs text-slate-500 mt-1">
              Add at least one dimension to rate models on.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-2">
          <div>
            {existingCategory && onDelete && (
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
              disabled={!name.trim() || dimensions.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
            >
              {existingCategory ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
