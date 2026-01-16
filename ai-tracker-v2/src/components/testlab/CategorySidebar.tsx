import { Category } from '../../types';

interface CategorySidebarProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddCategory: () => void;
}

export function CategorySidebar({
  categories,
  selectedId,
  onSelect,
  onAddCategory,
}: CategorySidebarProps) {
  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-full">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          Categories
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`w-full text-left px-4 py-3 border-b border-slate-700/50 transition-colors ${
              selectedId === category.id
                ? 'bg-slate-700 text-slate-100'
                : 'text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            <div className="font-medium">{category.name}</div>
            <div className="text-xs text-slate-500 mt-0.5">
              {category.dimensions.length} dimension{category.dimensions.length !== 1 ? 's' : ''}
            </div>
          </button>
        ))}

        {categories.length === 0 && (
          <div className="p-4 text-sm text-slate-500 text-center">
            No categories yet
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onAddCategory}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>
    </div>
  );
}
