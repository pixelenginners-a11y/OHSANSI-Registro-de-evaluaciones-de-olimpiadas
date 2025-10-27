import React from "react";

interface SelectOption {
  id: number;
  name: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, name, options, placeholder = "Seleccionar", error, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1 mb-3">
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <select
          id={name}
          name={name}
          ref={ref}
          {...rest}
          className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);
