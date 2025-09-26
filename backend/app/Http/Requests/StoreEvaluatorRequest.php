<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEvaluatorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required','string','max:100'],
            'username'  => ['required','string','alpha_dash','max:50','unique:users,username'],
            'email'     => ['required','email:rfc,dns','max:50','unique:users,email'],
            'phone'     => ['nullable','string','max:20'],
            'password'  => ['required','string','min:6'],
            'role_id'   => ['nullable','exists:roles,id'],
            'area_id'  => ['required','exists:areas,id'],
            'active'    => ['nullable','boolean'],
        ];
    }

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

            'role_id.exists'  => 'El rol seleccionado no es válido.',
            'area_id.required'=> 'Debe asignarse un área al evaluador.',
            'area_id.exists'  => 'El área seleccionada no es válida.',

            'active.boolean' => 'El valor de activo debe ser verdadero o falso.',
        ];
    }
}
