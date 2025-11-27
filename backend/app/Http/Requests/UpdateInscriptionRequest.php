<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInscriptionRequest extends FormRequest
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
            'area_id'   => 'sometimes|exists:areas,id',
            'grade_id'  => 'sometimes|exists:grades,id',

            'status'    => 'sometimes|in:pending,approved,rejected',
            'group_id'  => 'sometimes|exists:groups,id',

            'olympian.full_name'              => 'sometimes|string|max:100',
            'olympian.identity_document'      => 'sometimes|string|max:20|unique:olympians,identity_document,' . $this->route('id') . ',id',
            'olympian.educational_institution'=> 'sometimes|string|max:100',
            'olympian.department'             => 'sometimes|string|max:50',
            'olympian.academic_tutor'         => 'nullable|string|max:100',
        ];
    }

        public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $inscription = Inscription::find($this->route('id'));

            if (!$inscription) {
                return;
            }

            $areaId = $this->area_id ?? $inscription->area_id;

            $area = Area::find($areaId);
            if (!$area) return;

            if ($area->is_group) {
                if (!$this->has('group_id') || empty($this->group_id)) {
                    $validator->errors()->add(
                        'group_id',
                        "Debes seleccionar un grupo porque el área '{$area->name}' es grupal."
                    );
                }
            }

            else {
                if ($this->has('group_id') && !empty($this->group_id)) {
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
            'area_id.exists'   => 'El área seleccionada no existe.',
            'grade_id.exists'  => 'El grado seleccionado no existe.',
            'status.in'        => 'El estado debe ser pending, approved o rejected.',
            'group_id.exists'  => 'El grupo seleccionado no existe.',

            'olympian.full_name.string' => 'El nombre del olímpico debe ser un texto válido.',
            'olympian.identity_document.unique' => 'El documento de identidad ya está registrado para otro olímpico.',
        ];
    }
}
