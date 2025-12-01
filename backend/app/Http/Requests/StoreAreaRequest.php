<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAreaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:areas,name',
            'description' => 'nullable|string',
            'active' => 'sometimes|boolean',
            'responsable_id' => 'nullable|exists:users,id',
            'is_group' => 'required|boolean',
            // 'group_min_size' => 'required_if:is_group,1|integer|min:1',
            // 'group_max_size' => 'required_if:is_group,1|integer|min:1|gte:group_min_size',

            'gold' => 'sometimes|integer|min:0',
            'silver' => 'sometimes|integer|min:0',
            'bronze' => 'sometimes|integer|min:0',
            'honor_mentions' => 'sometimes|integer|min:0',

            'grades' => 'sometimes|array',
            'grades.*' => 'integer|exists:grades,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del área es obligatorio.',
            'name.unique' => 'Ya existe un área con este nombre.',
            'name.string' => 'El nombre del área debe ser texto.',
            'name.max' => 'El nombre del área no puede exceder 255 caracteres.',
            'is_group.required' => 'Debe especificar si el área es grupal.',
            'is_group.boolean' => 'El valor de el grupo no es correcto.',
            // 'group_min_size.required_if' => 'El tamaño mínimo del grupo es obligatorio cuando el área es grupal.',
            // 'group_min_size.integer' => 'El tamaño mínimo del grupo debe ser un número entero.',
            // 'group_min_size.min' => 'El tamaño mínimo del grupo debe ser al menos 1.',
            // 'group_max_size.required_if' => 'El tamaño máximo del grupo es obligatorio cuando el área es grupal.',
            // 'group_max_size.integer' => 'El tamaño máximo del grupo debe ser un número entero.',
            // 'group_max_size.min' => 'El tamaño máximo del grupo debe ser al menos 1.',
            // 'group_max_size.gte' => 'El tamaño máximo del grupo debe ser mayor o igual al tamaño mínimo del grupo.',



            'responsable_id.exists' => 'El responsable seleccionado no existe.',

            'gold.integer' => 'La cantidad de medallas de oro debe ser un número.',
            'gold.min' => 'La cantidad de medallas de oro no puede ser negativa.',

            'silver.integer' => 'La cantidad de medallas de plata debe ser un número.',
            'silver.min' => 'La cantidad de medallas de plata no puede ser negativa.',

            'bronze.integer' => 'La cantidad de medallas de bronce debe ser un número.',
            'bronze.min' => 'La cantidad de medallas de bronce no puede ser negativa.',

            'grades.*.exists' => 'Se requi.',
            'grades.array' => 'Los grados deben enviarse como un arreglo.',
            'grades.*.integer' => 'Cada grado debe ser un ID válido.',
        ];
    }
}
