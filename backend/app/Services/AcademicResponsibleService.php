<?php

namespace App\Services;

use App\Models\User;
use App\Services\UserService;
use App\Services\AreaService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use \Illuminate\Database\Eloquent\Collection;

class AcademicResponsibleService
{
    public function __construct(
        protected UserService $userService,
        protected AreaService $areaService
    ) {}

    public function create(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = $this->userService->createUser([
                'full_name' => $data['full_name'],
                'username' => $data['username'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'password' => $data['password'],
                'role_id' => 3,
            ]);
            $assign = $this->areaService->assignResponsible($data['area_id'], $user->id);
            return $this->getById($user->id);
        });
    }

    public function update(int $userId, array $data): ?User
    {
        return DB::transaction(function () use ($userId, $data) {
            $this->userService->ensureUserHasRole($userId, 'Responsable Academico');
            if (isset($data['area_id'])) {
                $this->areaService->assignResponsible($data['area_id'], $userId);
            }
            $user = $this->userService->updateUser($userId, $data);
            return $this->getById($userId);
        });
    }

    public function delete(int $userId): bool
    {
        return DB::transaction(function () use ($userId) {
            $this->areaService->unassignResponsible($userId);
            $this->userService->ensureUserHasRole($userId, 'Responsable Academico');
            return $this->userService->deleteUser($userId);
        });
    }

    public function getById(int $userId): ?User
    {
        return User::leftJoin('areas', 'users.id', '=', 'areas.responsable_id')
            ->leftJoin('roles', 'users.role_id', '=', 'roles.id')
            ->select(
                'users.id',
                'users.full_name',
                'users.username',
                'users.email',
                'users.phone',
                'users.active',
                'areas.id as area_id',
                'areas.name as area'
            )
            ->where('users.id', $userId)
            ->where('roles.name', 'Responsable Academico')
            ->first();
    }

    
    public function getAll(): LengthAwarePaginator
    {
        return User::select(
                'users.id',
                'users.full_name',
                'users.username',
                'users.email',
                'users.phone',
                'users.active',
                'areas.id as area_id',
                'areas.name as area'
            )
            ->leftJoin('areas', 'users.id', '=', 'areas.responsable_id')
            ->whereHas('role', function ($query) {
                $query->where('name', 'Responsable Academico');
            })
            ->orderBy('users.id', 'desc')
            ->paginate(10);
    }

    public function searchResponsibles(string $search, ?string $areaId = null, int $perPage = 10): LengthAwarePaginator
    {
        $searchLower = strtolower($search);
        
        return User::select(
                'users.id',
                'users.full_name',
                'users.username',
                'users.email',
                'users.phone',
                'users.active',
                'areas.id as area_id',
                'areas.name as area'
            )
            ->leftJoin('areas', 'users.id', '=', 'areas.responsable_id')
            ->whereHas('role', function ($query) {
                $query->where('name', 'Responsable Academico');
            })
            ->when(!empty($areaId), function ($query) use ($areaId) {
                $query->where('areas.id', $areaId);
            })
            ->when(!empty($search), function ($query) use ($searchLower) {
                $query->where(function ($q) use ($searchLower) {
                    $q->whereRaw('LOWER(users.full_name) like ?', ["%{$searchLower}%"])
                      ->orWhereRaw('LOWER(users.username) like ?', ["%{$searchLower}%"])
                      ->orWhereRaw('LOWER(users.email) like ?', ["%{$searchLower}%"]);
                });
            })
            ->distinct()
            ->orderBy('users.id', 'desc')
            ->paginate($perPage);
    }
}
