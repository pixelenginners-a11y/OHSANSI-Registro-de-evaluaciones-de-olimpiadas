import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  type?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const InputField = ({
  label,
  name,
  value,
  type = "text",
  placeholder,
  onChange,
  error
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-dark ${error ? "border-red-500" : "border-gray-300"
          }`}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
