interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = ({ label, error, ...rest }: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <label
        htmlFor={rest.name}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <input
        {...rest}
        className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-dark ${error ? "border-red-500" : "border-gray-300"
          }`}
      />

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
