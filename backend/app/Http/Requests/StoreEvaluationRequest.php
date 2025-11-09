<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Evaluation;

class StoreEvaluationRequest extends FormRequest
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
            'inscription_id' => [
                'nullable',
                'required_without:group_id', 
                'exists:inscriptions,id'
            ],
            'group_id' => [
                'nullable', 
                'required_without:inscription_id',
                'exists:groups,id'
            ],
            'evaluator_id'   => 'required|exists:users,id',
            'score'          => 'required|numeric|min:0|max:100',
            'description'    => 'nullable|string|max:1000',
            'phase'          => 'required|string|max:20',
            'status'         => 'required|in:' . implode(',', Evaluation::statuses()),
        ];
    }

    public function messages(): array
    {
        return [
            'inscription_id.exists'   => 'La inscripción seleccionada no existe.',

            'group_id.exists'   => 'El grupo seleccionado no existe.',

            'evaluator_id.required' => 'El evaluador es obligatorio.',
            'evaluator_id.exists'   => 'El evaluador seleccionado no existe.',

            'score.required' => 'La calificación es obligatoria.',
            'score.numeric'  => 'La calificación debe ser un número.',
            'score.min'      => 'La calificación no puede ser menor que 0.',
            'score.max'      => 'La calificación no puede ser mayor que 100.',

            'description.string' => 'La descripción debe ser texto.',
            'description.max'    => 'La descripción no puede superar los 1000 caracteres.',

            'phase.required' => 'La fase es obligatoria.',
            'phase.string'   => 'La fase debe ser texto.',
            'phase.max'      => 'La fase no puede superar los 20 caracteres.',

            'status.required' => 'El estado es obligatorio.',
            'status.in'       => 'El estado debe ser uno de los siguientes: clasificados, no_clasificados o desclasificados.',
        ];
    }
}
