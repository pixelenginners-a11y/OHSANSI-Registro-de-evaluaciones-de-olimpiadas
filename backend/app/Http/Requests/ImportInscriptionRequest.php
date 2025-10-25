<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImportInscriptionRequest extends FormRequest
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
            'data' => 'required|array',
            'data.*.olympian.full_name'              => 'required|string|max:100',
            'data.*.olympian.identity_document'      => 'required|string|max:20|unique:olympians,identity_document',
            'data.*.olympian.educational_institution'=> 'required|string|max:100',
            'data.*.olympian.department'             => 'required|string|max:50',
            'data.*.olympian.academic_tutor'         => 'nullable|string|max:100',

            'data.*.area_id'   => 'required|exists:areas,id',
            'data.*.grade_id'  => 'required|exists:grades,id',
            'data.*.status'    => 'nullable|string|in:pending,approved,rejected',
        ];
    }

    public function messages(): array
    {
        return [
            'data.required' => 'Los datos son obligatorios',
            'data.array' => 'Los datos deben ser un array',

            'data.*.olympian.full_name.required' => 'El nombre completo es obligatorio',
            'data.*.olympian.identity_document.required' => 'El documento de identidad es obligatorio',
            'data.*.olympian.identity_document.unique' => 'El documento de identidad ya está registrado',
            'data.*.olympian.educational_institution.required' => 'La institución educativa es obligatoria',
            'data.*.olympian.department.required' => 'El departamento es obligatorio',

            'data.*.area_id.required' => 'El área es obligatoria',
            'data.*.area_id.exists'   => 'El área seleccionada no existe',
            'data.*.grade_id.required'=> 'El grado es obligatorio',
            'data.*.grade_id.exists'  => 'El grado seleccionado no existe',
            'data.*.status.in'        => 'El estado debe ser pending, approved o rejected',
        ];
    }
}
