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

            'responsable_id.exists' => 'El responsable seleccionado no existe.',

            'gold.integer' => 'La cantidad de medallas de oro debe ser un número.',
            'gold.min' => 'La cantidad de medallas de oro no puede ser negativa.',

            'silver.integer' => 'La cantidad de medallas de plata debe ser un número.',
            'silver.min' => 'La cantidad de medallas de plata no puede ser negativa.',

            'bronze.integer' => 'La cantidad de medallas de bronce debe ser un número.',
            'bronze.min' => 'La cantidad de medallas de bronce no puede ser negativa.',

            'grades.*.exists' => 'Uno de los grados seleccionados no existe.',
        ];
    }
}
