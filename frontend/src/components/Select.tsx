type Option = {
  label: string;
  value: string | number;
};

type SelectProps = {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
};

export function Select({ value, onChange, options, placeholder = "Filtrar por...", className }: SelectProps) {

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-dark ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};
