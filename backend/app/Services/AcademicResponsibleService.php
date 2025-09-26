<?php

namespace App\Services;

use App\Models\User;
use App\Services\UserService;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use \Illuminate\Database\Eloquent\Collection;

class AcademicResponsibleService
{
    public function __construct(
        protected UserService $userService
    ) {}

    public function create(array $data): User
    {
        return DB::transaction(function () use ($data) {
            return $this->userService->createUser([
                'full_name' => $data['full_name'],
                'username' => $data['username'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'password' => $data['password'],
                'role_id' => 3,
            ]);
        });
    }

    public function update(int $userId, array $data): ?User
    {
        return DB::transaction(function () use ($userId, $data) {
            $this->userService->ensureUserHasRole($userId, 'Responsable Academico');
            return $this->userService->updateUser($userId, $data);
        });
    }

    public function delete(int $userId): bool
    {
        return DB::transaction(function () use ($userId) {
            $this->userService->ensureUserHasRole($userId, 'Responsable Academico');
            return $this->userService->deleteUser($userId);
        });
    }

    public function getById(int $userId): ?User
    {
        return $this->userService->findUserWithRole($userId, 'Responsable Academico');
    }

    public function getAll(): Collection
    {
        return User::select('id', 'full_name', 'username', 'email', 'phone', 'active')
            ->whereHas('role', function ($query) {
                $query->where('name', 'Responsable Academico');
            })
            ->orderBy('id', 'desc')
            ->get();
    }
}
