interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (starValue: number) => {
    if (!readonly && onChange) {
      // Toggle off if clicking same value
      onChange(value === starValue ? 0 : starValue);
    }
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          disabled={readonly}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <svg
            className={`${sizeClasses[size]} ${
              star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600 fill-slate-600'
            }`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

interface MultiStarRatingProps {
  dimensions: string[];
  values: Record<string, number>;
  onChange?: (dimension: string, value: number) => void;
  readonly?: boolean;
}

export function MultiStarRating({ dimensions, values, onChange, readonly = false }: MultiStarRatingProps) {
  return (
    <div className="space-y-2">
      {dimensions.map((dimension) => (
        <div key={dimension} className="flex items-center justify-between gap-4">
          <span className="text-sm text-slate-300 min-w-[140px]">{dimension}</span>
          <StarRating
            value={values[dimension] || 0}
            onChange={(value) => onChange?.(dimension, value)}
            readonly={readonly}
          />
        </div>
      ))}
    </div>
  );
}
