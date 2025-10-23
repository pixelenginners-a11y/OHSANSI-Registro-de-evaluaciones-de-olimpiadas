<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImportOlympianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => 'required|string|max:100',
            'identity_document' => 'required|string|max:20|unique:olympians',
            'educational_institution' => 'required|string|max:100',
            'department' => 'required|string|max:50',
            'academic_tutor' => 'nullable|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'El nombre completo es obligatorio.',
            'full_name.string' => 'El nombre completo debe ser texto.',
            'full_name.max' => 'El nombre completo no puede exceder los 100 caracteres.',

            'identity_document.required' => 'El documento de identidad es obligatorio.',
            'identity_document.string' => 'El documento de identidad debe ser texto.',
            'identity_document.max' => 'El documento de identidad no puede exceder los 20 caracteres.',
            'identity_document.unique' => 'Este documento de identidad ya está registrado.',

            'educational_institution.required' => 'La institución educativa es obligatoria.',
            'educational_institution.string' => 'La institución educativa debe ser texto.',
            'educational_institution.max' => 'La institución educativa no puede exceder los 100 caracteres.',

            'department.required' => 'El departamento es obligatorio.',
            'department.string' => 'El departamento debe ser texto.',
            'department.max' => 'El departamento no puede exceder los 50 caracteres.',

            'academic_tutor.string' => 'El tutor académico debe ser texto.',
            'academic_tutor.max' => 'El tutor académico no puede exceder los 100 caracteres.',
        ];
    }

    public function attributes(): array
    {
        return [
            'full_name' => 'nombre completo',
            'identity_document' => 'documento de identidad',
            'educational_institution' => 'institución educativa',
            'department' => 'departamento',
            'academic_tutor' => 'tutor académico',
        ];
    }
}
