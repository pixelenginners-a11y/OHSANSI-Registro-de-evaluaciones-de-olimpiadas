type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hasError: boolean;
  errors: string[];
  required?: boolean;
};

export default function FormField({ label, value, onChange, hasError, errors, required }: Props) {
  return (
    <div>
      <label className={`block text-sm font-medium mb-1 ${hasError ? 'text-rose-700' : 'text-neutral-700'}`}>
        {label} {required && <span className="text-rose-600">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
          hasError
            ? 'border-rose-300 bg-rose-50 text-rose-900 focus:border-rose-500 focus:ring-rose-500'
            : 'border-neutral-300 focus:border-blue-500 focus:ring-blue-500'
        }`}
      />
      {hasError && (
        <div className="mt-1 space-y-1">
          {errors.map((error, idx) => (
            <p key={idx} className="text-xs text-rose-600 flex items-start gap-1">
              <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
