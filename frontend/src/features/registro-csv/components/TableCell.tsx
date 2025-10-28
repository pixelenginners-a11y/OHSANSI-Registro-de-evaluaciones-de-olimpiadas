type Props = {
  value: string | number | null | undefined;
  hasError: boolean;
  onErrorClick: () => void;
};

export default function TableCell({ value, hasError, onErrorClick }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className={hasError ? 'text-rose-900' : ''}>{value || '-'}</span>
      {hasError && (
        <button
          onClick={onErrorClick}
          className="flex-shrink-0 text-rose-600 hover:text-rose-800 cursor-pointer"
          title="Ver error"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}
