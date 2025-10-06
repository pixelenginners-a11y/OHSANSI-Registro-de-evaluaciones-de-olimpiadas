<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOlympianRequest extends FormRequest
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
        $olympianId = $this->route('id');

        return [
            'full_name' => 'sometimes|required|string|max:100',
            'identity_document' => 'sometimes|required|string|max:20|unique:olympians,identity_document,' . $olympianId,
            'legal_guardian_contact' => 'sometimes|required|string|max:100',
            'educational_institution' => 'sometimes|required|string|max:100',
            'department' => 'sometimes|required|string|max:50',
            'school_grade' => 'sometimes|required|string|max:50',
            'academic_tutor' => 'sometimes|nullable|string|max:100',
        ];
    }
}
