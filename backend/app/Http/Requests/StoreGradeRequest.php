<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGradeRequest extends FormRequest
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
            'name' => 'required|string|max:50|unique:grades,name',
            'description' => 'nullable|string',
            'active' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del grado es obligatorio.',
            'name.unique' => 'Ya existe un grado con ese nombre.',
            'name.max' => 'El nombre del grado no puede tener más de 50 caracteres.',
            'active.boolean' => 'Porfavor cambia el valor de activo a uno valido.',
        ];
    }
}
