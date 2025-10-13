import React from "react";
import type { Control, FieldError } from "react-hook-form";
import { Controller } from "react-hook-form";

type Option = {
  label: string;
  value: string | number;
};

interface SelectFormProps {
  name: string;
  label: string;
  control: Control<any>;
  options: Option[];
  placeholder?: string;
  error?: FieldError;
  className?: string;
}

export const SelectForm: React.FC<SelectFormProps> = ({
  name,
  label,
  control,
  options,
  placeholder = "Selecciona una opción...",
  error,
  className = "",
}) => {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            id={name}
            {...field}
            value={field.value ?? ""}
            className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-dark ${error ? "border-red-500" : "border-gray-300"
              } ${className}`}
          >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      />

      {error && <span className="text-sm text-red-500">{error.message}</span>}
    </div>
  );
};
