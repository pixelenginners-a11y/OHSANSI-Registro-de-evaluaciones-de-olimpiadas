<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEvaluatorRequest extends FormRequest
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
        $userId = $this->route('id');

        return [
            'full_name'  => ['sometimes', 'string', 'max:100'],
            'username'   => [
                'sometimes',
                'string',
                'alpha_dash',
                'max:50',
                Rule::unique('users', 'username')->ignore($userId),
            ],
            'email'      => [
                'sometimes',
                'email:rfc,dns',
                'max:50',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'phone'      => ['nullable', 'string', 'max:20'],
            'password'   => ['sometimes', 'string', 'min:6'],
            'area_id'    => ['sometimes', 'exists:areas,id'],
            'active'     => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
          'full_name.max'      => 'El nombre completo no puede superar :max caracteres.',
          'username.alpha_dash'=> 'El nombre de usuario solo admite letras, números, guiones y guiones bajos.',
          'username.max'       => 'El nombre de usuario no puede superar :max caracteres.',
          'username.unique'    => 'Ese nombre de usuario ya existe.',
          'email.email'        => 'El email no tiene un formato válido.',
          'email.max'          => 'El email no puede superar :max caracteres.',
          'email.unique'       => 'Ese email ya existe.',
          'phone.max'          => 'El teléfono no puede superar :max caracteres.',
          'password.min'       => 'La contraseña debe tener al menos :min caracteres.',
          'area_id.exists'     => 'El área seleccionada no es válida.',
          'active.boolean'     => 'El valor de activo debe ser verdadero o falso.',
        ];  
    }
}
