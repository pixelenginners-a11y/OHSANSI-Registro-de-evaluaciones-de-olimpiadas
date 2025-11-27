<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInscriptionRequest extends FormRequest
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
            'olympian.full_name'              => 'required|string|max:100',
            'olympian.identity_document'      => 'required|string|max:20|unique:olympians,identity_document',
            'olympian.educational_institution'=> 'required|string|max:100',
            'olympian.department'             => 'required|string|max:50',
            'olympian.academic_tutor'         => 'nullable|string|max:100',

            'area_id'   => 'required|exists:areas,id',
            'grade_id'  => 'required|exists:grades,id',
            'status'    => 'nullable|string|in:pending,approved,rejected',
            'group_id'  => 'nullable|exists:groups,id',
        ];
    }

        public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $area = Area::find($this->area_id);

            if (!$area) {
                return;
            }

            if ($area->is_group) {
                if (empty($this->group_id)) {
                    $validator->errors()->add(
                        'group_id',
                        "Debes seleccionar un grupo porque el área '{$area->name}' es grupal."
                    );
                }
            }

            else {
                if (!empty($this->group_id)) {
                    $validator->errors()->add(
                        'group_id',
                        "El área '{$area->name}' no es grupal, por lo que no debes seleccionar un grupo."
                    );
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'olympian.full_name.required' => 'El nombre completo es obligatorio',
            'olympian.identity_document.required' => 'El documento de identidad es obligatorio',
            'olympian.identity_document.unique' => 'El documento de identidad ya está registrado',
            'olympian.educational_institution.required' => 'La institución educativa es obligatoria',
            'olympian.department.required' => 'El departamento es obligatorio',

            'area_id.required' => 'El área es obligatoria',
            'area_id.exists'   => 'El área seleccionada no existe',
            'grade_id.required'=> 'El grado es obligatorio',
            'grade_id.exists'  => 'El grado seleccionado no existe',
            'status.in'        => 'El estado debe ser pending, approved o rejected',
            'group_id.exists' => 'El grupo seleccionado no existe',
        ];
    }
}
