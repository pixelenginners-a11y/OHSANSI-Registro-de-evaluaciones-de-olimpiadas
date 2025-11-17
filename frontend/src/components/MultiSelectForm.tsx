import { Controller, type Control } from "react-hook-form";

interface Option {
  value: number;
  label: string;
}

interface MultiSelectFormProps {
  name: string;
  label: string;
  control: Control<any>;
  options: Option[];
  placeholder?: string;
  error?: any;
  className?: string;
}

export const MultiSelectForm = ({
  name,
  label,
  control,
  options,
  error,
  className = "",
}: MultiSelectFormProps) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>

        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            const allSelected = field.value?.length === options.length;

            return (
              <button
                type="button"
                onClick={() => {
                  if (allSelected) {
                    field.onChange([]);
                  } else {
                    field.onChange(options.map(opt => opt.value));
                  }
                }}
                className="text-xs text-primary-dark hover:text-primary font-medium"
              >
                {allSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </button>
            );
          }}
        />
      </div>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const currentValues = field.value || [];

          return (
            <>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-gray-50">
                {options.map((option) => {
                  const isChecked = currentValues.includes(option.value);

                  return (
                    <label
                      key={option.value}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange([...currentValues, option.value]);
                          } else {
                            field.onChange(
                              currentValues.filter((val: number) => val !== option.value)
                            );
                          }
                        }}
                        className="w-4 h-4 text-primary-dark border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  );
                })}

                {options.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">
                    No hay opciones disponibles
                  </p>
                )}
              </div>

              <p className="mt-1 text-xs text-gray-600">
                {currentValues.length > 0
                  ? `${currentValues.length} ${currentValues.length === 1 ? 'grado seleccionado' : 'grados seleccionados'}`
                  : 'Ningún grado seleccionado'}
              </p>
            </>
          );
        }}
      />

      {error?.message && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};
