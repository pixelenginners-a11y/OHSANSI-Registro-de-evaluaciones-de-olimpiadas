<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOlympianRequest extends FormRequest
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
            'full_name' => 'required|string|max:100',
            'identity_document' => 'required|string|max:20|unique:olympians,identity_document',
            'legal_guardian_contact' => 'required|string|max:100',
            'educational_institution' => 'required|string|max:100',
            'department' => 'required|string|max:50',
            'school_grade' => 'required|string|max:50',
            'academic_tutor' => 'nullable|string|max:100',
        ];
    }
}
