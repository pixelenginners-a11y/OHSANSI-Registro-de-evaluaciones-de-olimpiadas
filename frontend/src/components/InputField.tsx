interface InputFieldProps{
  label: string;
  name: string;
  type?: React.HTMLInputTypeAttribute;
  error?: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

export const InputField = ({ label, name, type, error, value, onChange, required, disabled }: InputFieldProps) => {
    return (
      <div className="flex flex-col gap-1 mb-3">
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-dark ${error ? "border-red-500" : "border-gray-300"}`}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
}

