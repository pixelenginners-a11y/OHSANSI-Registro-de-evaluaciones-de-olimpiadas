<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Services\LogService;

class UserService
{
    public function __construct(
        protected LogService $logService
    ) {}

    public function createUser(array $data): User
    {
        $user = User::create([
            'full_name' => $data['full_name'],
            'username' => $data['username'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => Hash::make($data['password']),
            'role_id' => $data['role_id']
        ]);

        $this->logService->record(
            'user.created',
            'User',
            $user->id,
            [
                'metadata' => [
                    'role_id' => $user->role_id,
                    'email' => $user->email,
                ],
            ]
        );

        return $user;
    }

    public function updateUser($userId, array $data): ?User
    {
        $user = User::findOrFail($userId);
        $before = $user->only(['full_name', 'username', 'email', 'phone', 'role_id', 'active']);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        $this->logService->record(
            'user.updated',
            'User',
            $user->id,
            [
                'metadata' => [
                    'before' => $before,
                    'after' => $user->only(['full_name', 'username', 'email', 'phone', 'role_id', 'active']),
                ],
            ]
        );
        return $user;
    }

    public function deleteUser($userId): bool
    {
        $user = User::findOrFail($userId);
        $deleted = $user->delete();

        $this->logService->record(
            'user.deleted',
            'User',
            $user->id,
            [
                'metadata' => [
                    'email' => $user->email,
                    'role_id' => $user->role_id,
                ],
            ]
        );

        return $deleted;
    }

    public function getUsers()
    {
        return User::all();
    }

    public function getUserById($userId): ?User
    {
        return User::findOrFail($userId);
    }

    public function findUserWithRole($userId, $roleId): ?User
    {
        return User::where('id', $userId)
            ->whereHas('role', function ($query) use ($roleId) {
                $query->where('name', $roleId);
            })
            ->first();
    }

    public function getUserRole($userId)
    {
        $user = User::with('role')->findOrFail($userId);
        return $user ? $user->role : null;
    }

    public function ensureUserHasRole(int $userId, string $roleName): void
    {
        $role = $this->getUserRole($userId);

        if (!$role || $role->name !== $roleName) {
            throw ValidationException::withMessages([
                'role' => ["El usuario no es un $roleName."]
            ]);
        }
    }
}
