<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Requests\StoreEvaluatorRequest;

abstract class UserController extends Controller
{
    public function store(StoreEvaluatorRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);
        if (method_exists($user, 'assignRole')) {
            $user->assignRole('Evaluador');
        }
        return response()->json([
            'message' => 'Evaluador creado correctamente',
            'data' => $user,
        ], 201);
    }
    public function index()
    {
        $evaluadores = User::select('id', 'full_name', 'email')
            ->orderBy('id', 'desc')
            ->get();
        return response()->json($evaluadores, 200);
    }

    public function destroy(User $user)
    {
        $user->delete();
        // 204 No Content es estándar para delete exitoso
        return response()->noContent();
    }
    
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'full_name' => ['sometimes','string','max:100'],
            'username'  => [
                'sometimes','string','alpha_dash','max:50',
                Rule::unique('users','username')->ignore($user->id)
            ],
            'email'     => [
                'sometimes','email:rfc,dns','max:50',
                Rule::unique('users','email')->ignore($user->id)
            ],
            'phone'     => ['sometimes','nullable','string','max:20'],
            'password'  => ['sometimes','string','min:6'],
            // Si manejas rol por Spatie (opcional):
            'role'      => ['sometimes','string'], // p.ej. "Evaluador"
            // Si asignas rol por id en tu propio campo (opcional):
            'role_id'   => ['sometimes','nullable','exists:roles,id'],
            'active'    => ['sometimes','boolean'],
        ]);

        if (array_key_exists('password', $validated)) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->fill($validated);
        $user->save();

        // Si usas Spatie Permission:
        if ($request->filled('role') && method_exists($user, 'syncRoles')) {
            $user->syncRoles([$request->string('role')]);
        }

        return response()->json([
            'message' => 'Evaluador actualizado correctamente',
            'data'    => $user->only(['id','full_name','email','username','phone','active']),
        ], 200);
    }
}
