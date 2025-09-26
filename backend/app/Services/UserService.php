<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function createUser(array $data): User
    {
        return User::create([
            'full_name' => $data['full_name'],
            'username' => $data['username'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => Hash::make($data['password']),
            'role_id' => $data['role_id']
        ]);
    }

    public function updateUser($userId, array $data): ?User
    {
        $user = User::findOrFail($userId);
        $user->update($data);
        return $user;
    }

    public function deleteUser($userId): bool
    {
        return User::findOrFail($userId)->delete();
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
}