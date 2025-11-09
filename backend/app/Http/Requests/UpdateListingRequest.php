<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateListingRequest extends FormRequest
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
            'name' => [
                'sometimes',
                'string',
                'max:100'
            ],
            'area_id' => [
                'sometimes',
                'integer',
                'exists:areas,id'
            ],
            'grade_id' => [
                'sometimes', 
                'integer',
                'exists:grades,id'
            ],
            'type' => [
                'sometimes',
                'string',
                'max:50',
                Rule::in(['concursantes', 'clasificados', 'no_clasificados', 'desclasificados', 'premiados', 'certificados', 'ceremonia', 'publicacion'])
            ],
            'description' => [
                'nullable',
                'string',
                'max:1000'
            ],
            'is_published' => [
                'sometimes',
                'boolean'
            ],
            'published_at' => [
                'nullable',
                'date',
                'after_or_equal:now'
            ],
            'visibility' => [
                'nullable',
                'string',
                'max:20',
                Rule::in(['publico', 'privado', 'restringido'])
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'name.string' => 'El nombre debe ser texto.',
            'name.max' => 'El nombre no puede superar los 100 caracteres.',
            
            'area_id.integer' => 'El área debe ser un ID válido.',
            'area_id.exists' => 'El área seleccionada no existe.',
            
            'grade_id.integer' => 'El grado debe ser un ID válido.',
            'grade_id.exists' => 'El grado seleccionado no existe.',
            
            'type.string' => 'El tipo debe ser texto.',
            'type.max' => 'El tipo no puede superar los 50 caracteres.',
            'type.in' => 'El tipo debe ser: concursantes, clasificados, no_clasificados, desclasificados, premiados, certificados, ceremonia o publicacion.',
            
            'description.string' => 'La descripción debe ser texto.',
            'description.max' => 'La descripción no puede superar los 1000 caracteres.',
            
            'is_published.boolean' => 'El estado de publicación debe ser verdadero o falso.',
            
            'published_at.date' => 'La fecha de publicación debe ser una fecha válida.',
            'published_at.after_or_equal' => 'La fecha de publicación no puede ser en el pasado.',
            
            'visibility.string' => 'La visibilidad debe ser texto.',
            'visibility.max' => 'La visibilidad no puede superar los 20 caracteres.',
            'visibility.in' => 'La visibilidad debe ser: publico, privado o restringido.',
        ];
    }
}