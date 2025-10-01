<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAcademicRequest extends FormRequest
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
            'full_name' => ['required', 'string', 'max:100'],
            'username'  => ['required', 'string', 'alpha_dash', 'max:50', 'unique:users,username'],
            'email'     => ['required', 'email:rfc,dns', 'max:50', 'unique:users,email'],
            'phone'     => ['nullable', 'string', 'max:20'],
            'password'  => ['required', 'string', 'min:6'],
            'active'    => ['nullable', 'boolean'],
        ];
    }

    /**
     * Get the custom validation messages for the request.
     *
     * @return array Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'full_name.required' => 'El nombre completo es obligatorio.',
            'full_name.max'      => 'El nombre completo no puede superar :max caracteres.',

            'username.required'  => 'El nombre de usuario es obligatorio.',
            'username.alpha_dash'=> 'El nombre de usuario solo admite letras, números, guiones y guiones bajos.',
            'username.max'       => 'El nombre de usuario no puede superar :max caracteres.',
            'username.unique'    => 'Ese nombre de usuario ya existe.',

            'email.required'     => 'El email es obligatorio.',
            'email.email'        => 'El email no tiene un formato válido.',
            'email.max'          => 'El email no puede superar :max caracteres.',
            'email.unique'       => 'Ese email ya existe.',

            'phone.max'          => 'El teléfono no puede superar :max caracteres.',

            'password.required'  => 'La contraseña es obligatoria.',
            'password.min'       => 'La contraseña debe tener al menos :min caracteres.',

            'active.boolean'     => 'El valor de activo debe ser verdadero o falso.',
        ];
    }
}
