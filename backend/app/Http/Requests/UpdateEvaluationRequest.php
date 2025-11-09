<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Evaluation;

class UpdateEvaluationRequest extends FormRequest
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
            'score'          => 'sometimes|numeric|min:0|max:100',
            'description'    => 'nullable|string|max:1000',
            'status'         => 'sometimes|in:' . implode(',', Evaluation::statuses()),
        ];
    }

    public function messages(): array
    {
        return [
            'inscription_id.exists' => 'La inscripción seleccionada no existe.',
            'group_id.exists'       => 'El grupo seleccionado no existe.',
            'evaluator_id.exists'   => 'El evaluador seleccionado no existe.',

            'score.numeric' => 'La calificación debe ser un número.',
            'score.min'     => 'La calificación no puede ser menor que 0.',
            'score.max'     => 'La calificación no puede ser mayor que 100.',

            'description.string' => 'La descripción debe ser texto.',
            'description.max'    => 'La descripción no puede superar los 1000 caracteres.',

            'phase.string' => 'La fase debe ser texto.',
            'phase.max'    => 'La fase no puede superar los 20 caracteres.',

            'status.in' => 'El estado debe ser uno de los siguientes: pendiente, clasificado, no_clasificado o desclasificado.',
        ];
    }
}
