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
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'ci' => 'sometimes|required|string|max:20|unique:olympians,ci,' . $olympianId,
            'birthdate' => 'sometimes|required|date',
            'grade_id' => 'sometimes|required|exists:grades,id',
            'area_id' => 'sometimes|required|exists:areas,id',
        ];
    }
}
