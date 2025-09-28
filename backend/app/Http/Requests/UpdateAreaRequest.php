<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAreaRequest extends FormRequest
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
            'area.name' => 'sometimes|string|max:255|unique:areas,name,' . $this->route('id'),
            'area.description' => 'sometimes|nullable|string',
            'area.active' => 'sometimes|boolean',
            'area.responsable_id' => 'sometimes|nullable|exists:users,id',

            'medalParameter.gold' => 'sometimes|integer|min:0',
            'medalParameter.silver' => 'sometimes|integer|min:0',
            'medalParameter.bronze' => 'sometimes|integer|min:0',
            'medalParameter.honor_mentions' => 'sometimes|integer|min:0',

            'grades' => 'sometimes|array',
            'grades.*' => 'integer|exists:grades,id',
        ];
    }

    public function messages(): array
    {
        return [
            'area.name.string' => 'El nombre del área debe ser texto.',
            'area.name.max' => 'El nombre del área no puede exceder 255 caracteres.',
            'area.name.unique' => 'Ya existe un área con este nombre.',

            'area.responsable_id.exists' => 'El responsable seleccionado no existe.',

            'medalParameter.gold.integer' => 'La cantidad de medallas de oro debe ser un número.',
            'medalParameter.gold.min' => 'La cantidad de medallas de oro no puede ser negativa.',

            'medalParameter.silver.integer' => 'La cantidad de medallas de plata debe ser un número.',
            'medalParameter.silver.min' => 'La cantidad de medallas de plata no puede ser negativa.',

            'medalParameter.bronze.integer' => 'La cantidad de medallas de bronce debe ser un número.',
            'medalParameter.bronze.min' => 'La cantidad de medallas de bronce no puede ser negativa.',

            'grades.array' => 'Los grados deben enviarse como un arreglo.',
            'grades.*.integer' => 'Cada grado debe ser un ID válido.',
            'grades.*.exists' => 'Uno de los IDs de grado enviados no existe.',
        ];
    }
}
